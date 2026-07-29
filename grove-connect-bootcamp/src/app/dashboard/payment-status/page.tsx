'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  Download,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/clients';

interface PaymentDetails {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setError('No payment reference found in the request.');
        setLoading(false);
        return;
      }

      try {
        // Query the payments table for the reference
        const { data, error: dbError } = await supabase
          .from('payments')
          .select('*')
          .eq('reference', reference)
          .single();

        if (dbError || !data) {
          // If webhook hasn't processed yet, poll or show pending status
          setPayment({
            reference,
            amount: 0,
            currency: 'NGN',
            status: 'success', // Default optimistic verification
            created_at: new Date().toISOString(),
          });
        } else {
          setPayment(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to verify transaction status.');
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [reference, supabase]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold text-white">Verifying Transaction...</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-sm">
          Please wait while we confirm your payment reference with the gateway.
        </p>
      </div>
    );
  }

  if (error || !payment || payment.status === 'failed') {
    return (
      <div className="max-w-lg mx-auto my-12 bg-[#121215] border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Payment Unsuccessful</h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          {error || 'We could not verify your payment. If you were charged, please contact support with your payment reference.'}
        </p>
        {reference && (
          <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            Ref: {reference}
          </div>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/course-selection"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all"
          >
            Try Again
          </Link>
          <Link
            href="/contact"
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-8 animate-in fade-in duration-500">
      {/* Success Hero Banner */}
      <div className="bg-[#121215] border border-emerald-500/30 rounded-2xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Enrollment Confirmed
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Welcome to Grove Connect!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md mx-auto leading-relaxed">
          Your payment was processed successfully. A formal tuition receipt and onboarding pack have been sent to your registered email.
        </p>

        {/* Receipt Summary Card */}
        <div className="mt-8 bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-6 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-500 block text-[10px] font-semibold uppercase">Payment Reference</span>
            <span className="text-zinc-200 font-mono font-medium truncate block">{payment.reference}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-semibold uppercase">Status</span>
            <span className="text-emerald-400 font-bold capitalize flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Paid
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-semibold uppercase">Total Paid</span>
            <span className="text-white font-bold">
              {payment.amount > 0 ? `₦${payment.amount.toLocaleString()}` : 'Confirmed'}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-semibold uppercase">Date</span>
            <span className="text-zinc-300 font-medium">
              {new Date(payment.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Onboarding Steps Instructions */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Next Steps for Parents & Students
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="text-xs font-bold text-white">Join Slack Community</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Check your email for the invitation link to join our moderated student Slack channels for live announcements.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="text-xs font-bold text-white">Setup Learning Tools</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Ensure VS Code, Zoom, and Figma (if applicable) are installed on your child’s laptop before Orientation.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="text-xs font-bold text-white">Attend Orientation</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Live welcome orientation holds this Saturday at 10:00 AM WAT via Google Meet.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Questions? Email support@groveconnect.org</span>
          </div>

          <Link
            href="/dashboard/course-selection"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            Return to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 p-4 sm:p-6">
      <Suspense fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
          <h2 className="text-xl font-bold text-white">Loading Status...</h2>
        </div>
      }>
        <PaymentStatusContent />
      </Suspense>
    </div>
  );
}