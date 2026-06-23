"use client";
import React from 'react';
import { CheckCircle, Crown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumPage = () => {
  const handlePayment = () => {
    // এখানে আপনার Stripe Payment Logic হবে
    console.log("Redirecting to Stripe checkout...");
  };

  const features = [
    "Access to all private/premium prompts",
    "Unlock prompt copying functionality",
    "Rate and review premium content",
    "Priority support & community access",
    "No ads & early access to new features"
  ];

  return (
    <div className="min-h-screen bg-slate-50  py-40 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Upgrade to Premium</h1>
          <p className="text-slate-600">Unlock full potential and access exclusive AI prompts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          {/* Left Side: Plan Details */}
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
              <Crown size={24} />
              <span className="uppercase tracking-widest text-sm">Pro Plan</span>
            </div>
            <h2 className="text-5xl font-extrabold text-slate-900 mb-6">$5.00 <span className="text-xl font-normal text-slate-500">/ one-time</span></h2>
            
            <ul className="space-y-4">
              {features.map((feat, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="text-green-500" size={20} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Action */}
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Ready to boost your productivity?</h3>
            <p className="text-sm text-slate-600 mb-6">Secure payment powered by Stripe. Instant access granted after payment.</p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              <Zap size={18} />
              Pay $5.00 Now
            </motion.button>
            
            <p className="text-center text-xs text-slate-400 mt-4">100% Secure Payment Process</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;