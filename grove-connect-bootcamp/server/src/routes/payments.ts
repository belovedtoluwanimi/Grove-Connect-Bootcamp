import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Lazy getter function ensures process.env values are read at request time
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from server environment.');
  }

  return createClient(url, key);
}

// Course Pricing Single Source of Truth
const COURSE_PRICES: Record<string, number> = {
  'fullstack-kids': 20000,
  'uiux-kids': 15000,
  'python-ai': 20000,
  'video-editing': 20000,
};

// Zod Schema Validation
const initializePaymentSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  cartItems: z.array(
    z.object({
      childName: z.string().min(2),
      childAge: z.string(),
      courseId: z.string(),
    })
  ).min(1, 'Cart must contain at least one item'),
});

/**
 * POST /api/payments/initialize
 * Handles cart verification, record insertion, and Paystack checkout session setup.
 */
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    // 0. Initialize Supabase safely inside the request
    const supabase = getSupabaseAdmin();

    // 1. Validate Payload
    const parsedData = initializePaymentSchema.parse(req.body);
    const { userId, email, cartItems } = parsedData;

    // 2. Recalculate Total Fee Server-Side
    let verifiedTotalAmount = 0;

    for (const item of cartItems) {
      const price = COURSE_PRICES[item.courseId];
      if (!price) {
        return res.status(400).json({ message: `Invalid course ID selected: ${item.courseId}` });
      }
      verifiedTotalAmount += price;
    }

    // Convert NGN amount to Kobo (Paystack requires smallest currency unit)
    const amountInKobo = verifiedTotalAmount * 100;
    const paymentReference = `GROVE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 3. Register Student Registrations in PostgreSQL via Supabase
    for (const item of cartItems) {
      const { error: regError } = await supabase.from('registrations').insert({
        user_id: userId,
        track: item.courseId,
        status: 'pending',
        payment_status: 'unpaid',
      });

      if (regError) {
        console.error('Registration DB Error:', regError);
        throw new Error('Failed to record student registration in database.');
      }
    }

    // 4. Initialize Transaction with Paystack API
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is missing from environment variables.');
    }

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        reference: paymentReference,
        callback_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/payment-status`,
        metadata: {
          user_id: userId,
          cart_items: cartItems,
          custom_fields: [
            {
              display_name: 'Company',
              variable_name: 'company',
              value: 'Grove Connect',
            },
          ],
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      throw new Error(paystackData.message || 'Paystack initialization failed.');
    }

    // 5. Store Payment Audit Trail Record
    const { error: paymentDbError } = await supabase.from('payments').insert({
      user_id: userId,
      registration_id: null, // Linked via payment reference during webhook
      amount: verifiedTotalAmount,
      currency: 'NGN',
      reference: paymentReference,
      provider: 'paystack',
      status: 'pending',
      raw_payload: cartItems,
    });

    if (paymentDbError) {
      console.error('Payment Audit Record Error:', paymentDbError);
    }

    // 6. Return Checkout URL to Frontend
    return res.status(200).json({
      status: 'success',
      checkoutUrl: paystackData.data.authorization_url,
      reference: paymentReference,
    });
  } catch (error: any) {
    console.error('Payment Initialization Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload schema', errors: error.issues });
    }
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

export default router;