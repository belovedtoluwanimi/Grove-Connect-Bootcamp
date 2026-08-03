'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Code2,
  Palette,
  Database,
  Cloud,
  Plus,
  Trash2,
  ShoppingCart,
  User,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Loader2,
  AlertCircle,
  Play,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/clients';

// Available Bootcamp Courses
const COURSES = [
  {
    id: 'fullstack-kids',
    title: 'Full-Stack Web Development',
    category: 'Coding & Web',
    ageRange: 'Ages 10–18',
    price: 20000,
    duration: '6 Weeks',
    icon: Code2,
    description: 'HTML5, CSS3, JavaScript, React, and Node.js backend foundations.',
  },
  {
    id: 'uiux-kids',
    title: 'Graphic & Product Design',
    category: 'Design & Creative',
    ageRange: 'Ages 10–18',
    price: 15000,
    duration: '6 Weeks',
    icon: Palette,
    description: 'Wireframing, color theory, prototyping, and Figma design systems.',
  },
  {
    id: 'python-ai',
    title: 'Python, Data Science & AI',
    category: 'Data & AI',
    ageRange: 'Ages 12–18',
    price: 20000,
    duration: '6 Weeks (Sat & Sun)',
    icon: Database,
    description: 'Data analytics with Python, algorithms, and intro to machine learning.',
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    category: 'Infrastructure',
    ageRange: 'Ages 12–18',
    price: 20000,
    duration: '6 Weeks (Sat & Sun)',
    icon: Play,
    description: 'Video editing, Social media video making, long form video',
  },
];

interface CartItem {
  id: string;
  childName: string;
  childAge: string;
  courseId: string;
  courseTitle: string;
  price: number;
}

export default function CourseSelectionDashboard() {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('10-13');
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Add course & child pair to cart
  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!childName.trim()) {
      setErrorMessage('Please enter your child’s full name before adding to cart.');
      return;
    }

    const course = COURSES.find((c) => c.id === selectedCourseId);
    if (!course) return;

    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      childName: childName.trim(),
      childAge,
      courseId: course.id,
      courseTitle: course.title,
      price: course.price,
    };

    setCart([...cart, newItem]);
    setChildName(''); // Reset child name field for potential next child
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  // Proceed to Express Payment API Initialization
  const handleProceedToPayment = async () => {
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please register at least one child and select a course.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Get current authenticated parent session
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Authentication session expired. Please sign in again.');
      }

      // API Call to Express.js Backend Payment Initialization Endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/initialize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            cartItems: cart,
            totalAmount: calculateTotal(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment gateway.');
      }

      // Redirect parent to Paystack / Flutterwave checkout page
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during payment setup.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-base shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              G
            </span>
            <span className="text-white">Grove</span>
            <span className="text-emerald-400">Connect</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Parent Portal</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-semibold flex items-center gap-2 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> Step 1 of 2: Child & Course Selection
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Register Student & Select Bootcamp Tracks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Fill in your child&apos;s details, pick their preferred bootcamp course, and add to cart.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Available Courses (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Child Details Input Card */}
            <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sm:p-8">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Child Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Child&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Doe"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Age Group
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  >
                    <option value="8-11">Ages 8 – 11 (Junior Tech)</option>
                    <option value="12-15">Ages 12 – 15 (Intermediate)</option>
                    <option value="16-18">Ages 16 – 18 (Senior Academy)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Course Catalog Selection */}
            <div>
              <h2 className="text-base font-bold text-white mb-4">Choose Bootcamp Course</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COURSES.map((course) => {
                  const Icon = course.icon;
                  const isSelected = selectedCourseId === course.id;

                  return (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                          : 'bg-[#121215] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`p-2.5 rounded-xl border ${
                              isSelected
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            {course.ageRange}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-zinc-100">{course.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                        <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {course.duration}
                        </span>
                        <span className="text-sm font-bold text-emerald-400">
                          ₦{course.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-6 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Student & Selected Course to Cart
              </button>
            </div>
          </div>

          {/* Right Column: Enrollment Cart & Checkout Summary (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  Enrollment Cart
                </h2>
                <span className="text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 space-y-2">
                  <ShoppingCart className="w-10 h-10 mx-auto stroke-1 text-zinc-600" />
                  <p className="text-xs">Your cart is currently empty.</p>
                  <p className="text-[11px] text-zinc-600">Enter your child&apos;s name and pick a track to add.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-200">{item.childName}</p>
                        <p className="text-emerald-400 font-medium">{item.courseTitle}</p>
                        <p className="text-[10px] text-zinc-500">Age: {item.childAge} yrs</p>
                      </div>

                      <div className="text-right space-y-2">
                        <span className="font-bold text-white block">
                          ₦{item.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Mentorship & Materials</span>
                  <span className="text-emerald-400">Included</span>
                </div>
                <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center font-bold text-sm text-white">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 text-base">
                    ₦{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proceed to Payment Button */}
              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={cart.length === 0 || isProcessing}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Proceed to Payment <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secured SSL 256-Bit Payment Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}