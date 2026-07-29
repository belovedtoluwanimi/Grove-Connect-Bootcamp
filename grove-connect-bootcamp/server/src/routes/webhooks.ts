import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const router = Router();
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
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY!;

    // 1. Verify HMAC SHA512 Webhook Signature
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    // 2. Listen for Successful Charge Event
    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const userId = metadata.user_id;

      // Update Payments Table Status
      await supabase
        .from('payments')
        .update({ status: 'success', raw_payload: event.data })
        .eq('reference', reference);

      // Update Student Registrations Payment Status to Paid
      await supabase
        .from('registrations')
        .update({ payment_status: 'paid', status: 'approved' })
        .eq('user_id', userId)
        .eq('payment_status', 'unpaid');

      console.log(`Payment successful for reference: ${reference}`);
    }

    // Acknowledge receipt to Paystack
    return res.status(200).send('Webhook Processed');
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).send('Webhook Internal Error');
  }
});

export default router;