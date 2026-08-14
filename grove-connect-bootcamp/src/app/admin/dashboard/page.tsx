'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  CreditCard,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  ShieldAlert,
  Loader2,
  RefreshCw,
  MoreVertical,
  ChevronDown,
  Lock,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/clients';

interface StudentRecord {
  id: string;
  user_id: string;
  track?: string;
  course_name?: string;
  student_name?: string;
  amount_paid?: number;
  reference?: string;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'unpaid' | 'paid' | 'failed';
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
    phone?: string;
    role?: string;
  };
}

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // 1. Strict Admin Authentication Guard
  useEffect(() => {
    async function verifyAdminAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_bootcamp_registered')
          .eq('id', user.id)
          .single();

        // Check if role is admin or email matches master admin
        const hasAdminAccess = profile?.role === 'admin' || user.email === 'groveconn3ct22@gmail.com';

        if (!hasAdminAccess) {
          router.replace('/dashboard');
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error('Admin verification error:', err);
        router.replace('/dashboard');
      } finally {
        setAuthChecking(false);
      }
    }

    verifyAdminAuth();
  }, [supabase, router]);

  // 2. Fetch all registrations with full details
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          user_id,
          track,
          course_name,
          student_name,
          amount_paid,
          reference,
          status,
          payment_status,
          created_at,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords((data as any) || []);
    } catch (err: any) {
      console.error('Error fetching registrations:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
    }
  }, [isAdmin]);

  // 3. Manual Approval & Status Update
  const handleStatusUpdate = async (
    id: string,
    newStatus: 'approved' | 'rejected' | 'pending',
    newPaymentStatus?: 'paid' | 'unpaid'
  ) => {
    setUpdatingId(id);
    try {
      const targetRecord = records.find((r) => r.id === id);
      const updateData: any = { status: newStatus };
      if (newPaymentStatus) updateData.payment_status = newPaymentStatus;

      // Update registrations record
      const { error: regError } = await supabase
        .from('registrations')
        .update(updateData)
        .eq('id', id);

      if (regError) throw regError;

      // Also ensure the user's payments record reflects success if marked paid
      if (newPaymentStatus === 'paid' && targetRecord?.reference) {
        await supabase
          .from('payments')
          .update({ status: 'success', payment_channel: 'admin_manual_override' })
          .eq('reference', targetRecord.reference);
      }

      await fetchRegistrations();
    } catch (err: any) {
      console.error('Error updating status:', err.message || err);
      alert(`Update failed: ${err.message || 'Check database permissions'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // 4. Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  // Filtered dataset calculation
  const filteredRecords = records.filter((rec) => {
    const parentName = rec.profiles?.full_name || '';
    const parentEmail = rec.profiles?.email || '';
    const studentName = rec.student_name || '';
    const courseName = rec.course_name || rec.track || '';
    const ref = rec.reference || '';

    const matchesSearch =
      parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      rec.payment_status === statusFilter ||
      rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level stats
  const totalStudents = records.length;
  const paidStudents = records.filter((r) => r.payment_status === 'paid').length;
  const pendingPayments = records.filter((r) => r.payment_status === 'unpaid').length;

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-400 text-xs">
        <Lock className="w-8 h-8 text-emerald-400 animate-pulse mb-3" />
        Verifying Administrative Access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-base shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              G
            </span>
            <span className="text-white">Grove</span>
            <span className="text-emerald-400 font-extrabold text-sm uppercase tracking-wider ml-1 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
              Admin Console
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRegistrations}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold px-3"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold px-3"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Student Registrations & Payments
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage cohort enrollments, verify payment references, and manually approve student courses.
          </p>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">Total Applications</p>
              <p className="text-2xl font-bold text-white mt-0.5">{totalStudents}</p>
            </div>
          </div>

          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">Confirmed / Paid</p>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">{paidStudents}</p>
            </div>
          </div>

          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">Pending Payment</p>
              <p className="text-2xl font-bold text-amber-400 mt-0.5">{pendingPayments}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by student, email, ref, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-zinc-500 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Payment: Paid</option>
              <option value="unpaid">Payment: Unpaid</option>
              <option value="approved">Status: Approved</option>
              <option value="pending">Status: Pending</option>
            </select>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
              <p className="text-xs text-zinc-400">Loading student records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-zinc-600 stroke-1" />
              <p className="text-xs font-semibold">No records match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Student & Parent</th>
                    <th className="p-4">Course Track</th>
                    <th className="p-4">Amount & Ref</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Approval</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {filteredRecords.map((item) => {
                    const isUpdating = updatingId === item.id;

                    return (
                      <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                        {/* Student & Parent */}
                        <td className="p-4">
                          <p className="font-bold text-white text-sm">
                            {item.student_name || item.profiles?.full_name || 'Registered Student'}
                          </p>
                          <p className="text-zinc-400 text-[11px] mt-0.5">
                            Parent: {item.profiles?.full_name || 'N/A'} ({item.profiles?.email || 'No email'})
                          </p>
                        </td>

                        {/* Course Name */}
                        <td className="p-4">
                          <span className="font-semibold text-emerald-400">
                            {item.course_name || item.track?.replace('-', ' ') || 'Bootcamp Track'}
                          </span>
                        </td>

                        {/* Amount & Reference */}
                        <td className="p-4">
                          <p className="font-bold text-zinc-200">
                            ₦{(item.amount_paid || 0).toLocaleString()}
                          </p>
                          <p className="text-zinc-500 font-mono text-[10px]">
                            {item.reference ? item.reference.substring(0, 16) : 'N/A'}
                          </p>
                        </td>

                        {/* Payment Status */}
                        <td className="p-4">
                          {item.payment_status === 'paid' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-[10px]">
                              <Clock className="w-3 h-3" /> Unpaid
                            </span>
                          )}
                        </td>

                        {/* Approval Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] capitalize ${
                              item.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : item.status === 'rejected'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-400 inline-block" />
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              {item.status !== 'approved' && (
                                <button
                                  onClick={() => handleStatusUpdate(item.id, 'approved', 'paid')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 text-[10px] font-bold transition-all"
                                >
                                  Approve & Mark Paid
                                </button>
                              )}

                              {item.status === 'approved' && (
                                <button
                                  onClick={() => handleStatusUpdate(item.id, 'pending', 'unpaid')}
                                  className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-[10px] transition-all"
                                >
                                  Reset to Unpaid
                                </button>
                              )}

                              {item.status !== 'rejected' && (
                                <button
                                  onClick={() => handleStatusUpdate(item.id, 'rejected')}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-bold transition-all"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}