'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Download,
  Mail,
  MessageSquare,
  Receipt,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  X,
  PhoneCall,
  CreditCard,
  User,
  Send,
  LogOut,
} from 'lucide-react';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { createClient } from '@/utils/supabase/clients'; // Note: Ensure this matches your file name (client vs clients)

interface PaidCourse {
  id: string;
  course_name: string;
  amount_paid: number;
  reference: string;
  payment_status: string;
  payment_channel?: string; // e.g., 'card', 'bank_transfer', 'ussd'
  created_at: string;
  student_name?: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enrollments, setEnrollments] = useState<PaidCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedReceipt, setSelectedReceipt] = useState<PaidCourse | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Active 10-minute automatic logout hook
  useInactivityTimeout(isAuthenticated);

  useEffect(() => {
    async function fetchUserDataAndCourses() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        // 🚨 STRICT AUTH CHECK: If no valid user is found, kick them to login
        if (!currentUser) {
          router.replace('/login');
          return; // Stop running the rest of the code
        }

        // If user exists, set their data
        setUser(currentUser);
        setIsAuthenticated(true);

        // Fetch ONLY successful/paid registrations from Supabase
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('user_id', currentUser.id)
          .in('payment_status', ['success', 'paid', 'successful']) // Filter out failed/abandoned payments
          .order('created_at', { ascending: false });

        if (!error && data) {
          setEnrollments(data);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDataAndCourses();
  }, [supabase, router]);

  // Handle printing/downloading receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // --- Manual Logout Handler ---
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    router.push('/login');
    router.refresh(); // Force a hard reload of the auth state
  };

  // Trigger Email Client with Pre-filled Confirmation Request/Notification
  const handleSendEmailConfirmation = (item: PaidCourse) => {
    const parentEmail = user?.email || 'parent@example.com';
    const parentName = user?.user_metadata?.full_name || 'Parent/Guardian';
    const student = item.student_name || parentName;
    const amountFormatted = (item.amount_paid || 0).toLocaleString();

    const subject = encodeURIComponent(`Payment Confirmation - ${item.course_name} (Ref: ${item.reference})`);
    const body = encodeURIComponent(
      `Hello Grove Connect Team,\n\n` +
      `I have completed the payment for the following enrollment:\n\n` +
      `• Course: ${item.course_name}\n` +
      `• Student Name: ${student}\n` +
      `• Payer Name: ${parentName}\n` +
      `• Amount Paid: ₦${amountFormatted}\n` +
      `• Payment Channel: ${item.payment_channel || 'Paystack Online'}\n` +
      `• Transaction Reference: ${item.reference}\n` +
      `• Date: ${new Date(item.created_at).toLocaleString()}\n\n` +
      `Please confirm receipt and send further onboarding details.\n\n` +
      `Thank you,\n${parentName} (${parentEmail})`
    );

    window.open(`mailto:hello@groveconnect.org?subject=${subject}&body=${body}`, '_blank');
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-0" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 relative z-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Parent & Student Portal
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{user?.user_metadata?.full_name || 'Parent'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              View verified course enrollments, access digital receipts, and confirm payment details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowContactModal(true)}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Confirm Enrollment
            </button>
            
            <Link
              href="/dashboard/course-selection"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <BookOpen className="w-4 h-4" /> Enroll New Track
            </Link>

            {/* --- Sign Out Button --- */}
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Confirmed Paid Enrollments
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-52 bg-zinc-900/60 rounded-3xl border border-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            /* Empty State */
            <div className="bg-[#121215] border border-zinc-800/80 rounded-3xl p-10 text-center max-w-xl mx-auto my-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No Confirmed Courses Found</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                You haven't completed payment for any bootcamp tracks yet. Choose a track today to give your child an edge in tech!
              </p>
              <Link
                href="/dashboard/course-selection"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Browse Available Courses
              </Link>
            </div>
          ) : (
            /* Paid Course Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#121215] border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-xl"
                >
                  <div>
                    {/* Top Status and Ref */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        ✓ Payment Confirmed
                      </span>

                      <span className="text-[11px] text-zinc-500 font-mono">
                        Ref: {item.reference ? item.reference.substring(0, 14) : 'N/A'}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-xl font-black text-white">{item.course_name || 'Bootcamp Track'}</h3>

                    {/* Student Name */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                      <User className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Student Name: <strong className="text-white font-bold">{item.student_name || user?.user_metadata?.full_name || 'Registered Student'}</strong></span>
                    </div>

                    {/* Payment Details */}
                    <div className="mt-4 space-y-2 text-xs text-zinc-400 pt-3 border-t border-zinc-800/60">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-zinc-500" /> Payment Method:
                        </span>
                        <span className="text-zinc-200 font-semibold uppercase text-[11px]">
                          {item.payment_channel || 'Paystack Online'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Date Paid:</span>
                        <span className="text-zinc-200 font-medium">
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-semibold text-zinc-300">Amount Paid:</span>
                        <span className="text-emerald-400 font-black text-base">
                          ₦{(item.amount_paid || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedReceipt(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Receipt className="w-4 h-4 text-emerald-400" /> View Receipt
                    </button>

                    <button
                      onClick={() => handleSendEmailConfirmation(item)}
                      className="py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold transition-all text-xs flex items-center gap-2"
                      title="Send Mail Confirmation"
                    >
                      <Send className="w-3.5 h-3.5" /> Mail Us
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ================= RECEIPT MODAL ================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl print:m-0 print:border-none print:shadow-none">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 text-zinc-500 hover:text-white print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-6 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-lg mx-auto mb-2">
                G
              </div>
              <h3 className="text-lg font-black text-white">Grove Connect</h3>
              <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold">Official Payment Receipt</p>
            </div>

            {/* Receipt Details */}
            <div className="py-6 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Transaction Ref:</span>
                <span className="font-mono text-zinc-200 font-bold">{selectedReceipt.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Student Name:</span>
                <span className="text-emerald-400 font-bold">
                  {selectedReceipt.student_name || user?.user_metadata?.full_name || 'Enrolled Student'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payer Name:</span>
                <span className="text-zinc-200 font-semibold">{user?.user_metadata?.full_name || 'Parent/Guardian'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Course Track:</span>
                <span className="text-white font-bold">{selectedReceipt.course_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Channel:</span>
                <span className="text-zinc-200 uppercase font-semibold">
                  {selectedReceipt.payment_channel || 'Paystack Online'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment Status:</span>
                <span className="text-emerald-400 font-extrabold uppercase">SUCCESSFUL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Date & Time:</span>
                <span className="text-zinc-200">{new Date(selectedReceipt.created_at).toLocaleString()}</span>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Amount Paid:</span>
                <span className="font-black text-emerald-400 text-lg">
                  ₦{(selectedReceipt.amount_paid || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="pt-4 border-t border-zinc-800 text-center">
              <p className="text-[10px] text-zinc-500">
                Thank you for investing in future tech talent with Grove Connect!
              </p>

              {emailSent && (
                <div className="mt-3 p-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[11px] font-semibold">
                  ✓ Email client opened! Send email to notify our desk.
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 print:hidden">
                <button
                  onClick={() => handleSendEmailConfirmation(selectedReceipt)}
                  className="w-full py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4 text-emerald-400" /> Email Confirmation
                </button>

                <button
                  onClick={handlePrintReceipt}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Download className="w-4 h-4" /> Save Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONTACT / CONFIRMATION MODAL ================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Confirm Enrollment & Support</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Need help or want to confirm your child's schedule? Contact our team directly.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* WhatsApp Support */}
              <a
                href="https://wa.me/2348000000000?text=Hello%20Grove%20Connect,%20I%20want%20to%20confirm%20my%20child's%20enrollment."
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      WhatsApp Desk
                    </h4>
                    <p className="text-zinc-500 text-[11px]">Chat directly with an enrollment manager</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </a>

              {/* Direct Mail */}
              <a
                href="mailto:hello@groveconnect.org?subject=Enrollment%20Confirmation"
                className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-teal-400 transition-colors">
                      Direct Email Support
                    </h4>
                    <p className="text-zinc-500 text-[11px]">hello@groveconnect.org</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}