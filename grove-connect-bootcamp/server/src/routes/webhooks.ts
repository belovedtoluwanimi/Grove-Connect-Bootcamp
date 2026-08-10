import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Initialize Supabase client using Service Role key for elevated backend updates
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/webhooks/paystack
 * Verified webhook handler to sync database states upon payment completion.
 */
router.post('/paystack', async (req: Request, res: Response) => {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is missing in environment variables');
      return res.status(500).send('Secret key missing');
    }

    // 1. Grab raw body buffer (saved from express.json verify hook) or fallback to stringified body
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    // 2. Verify HMAC SHA512 Webhook Signature
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(rawBody)
      .digest('hex');

    const signature = req.headers['x-paystack-signature'];

    if (hash !== signature) {
      console.warn('⚠️ Unauthorized Paystack Webhook signature mismatch!');
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    // 3. Process Successful Charge Event
    if (event.event === 'charge.success') {
      const { reference, metadata, channel, amount } = event.data;
      const userId = metadata?.user_id;
      const paymentType = metadata?.type;
      const amountInNaira = amount ? amount / 100 : 0;

      console.log(`✓ Webhook verified for reference: ${reference} (Amount: ₦${amountInNaira})`);

      // Update General Payments Record
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'success',
          payment_channel: channel || 'paystack',
          raw_payload: event.data,
        })
        .eq('reference', reference);

      if (paymentError) {
        console.error('Error updating payments table:', paymentError);
      }

      // Branch A: Handle ₦1,500 Mandatory Registration Fee
      if (paymentType === 'bootcamp_registration' && userId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_bootcamp_registered: true })
          .eq('id', userId);

        if (profileError) {
          console.error('Error unlocking student profile registration:', profileError);
        } else {
          console.log(`✓ Student profile unlocked for User ID: ${userId}`);
        }
      }

      // Branch B: Handle Course Track Purchase
      if (userId && paymentType !== 'bootcamp_registration') {
        const { error: regError } = await supabase
          .from('registrations')
          .update({
            payment_status: 'paid',
            status: 'approved',
            payment_channel: channel || 'card',
          })
          .eq('user_id', userId)
          .eq('reference', reference);

        if (regError) {
          // Fallback to updating unpaid records for the user if reference isn't matched directly
          await supabase
            .from('registrations')
            .update({
              payment_status: 'paid',
              status: 'approved',
              payment_channel: channel || 'card',
            })
            .eq('user_id', userId)
            .eq('payment_status', 'unpaid');
        }
      }
    }

    // Acknowledge receipt with 200 HTTP status to Paystack
    return res.status(200).send('Webhook Processed');
  } catch (error: any) {
    console.error('Webhook Internal Error:', error.message || error);
    return res.status(500).send('Webhook Internal Error');
  }
});

export default router;