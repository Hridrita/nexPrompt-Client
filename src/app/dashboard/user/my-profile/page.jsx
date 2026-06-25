import { getPromptsByCreators } from '@/lib/api/prompts';
import { getUserSession } from '@/lib/core/session';
import { Crown, Mail, Package, Shield, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ProfilePage = async () => {
  const user = await getUserSession();
  if (!user) return (
    <div className="p-8 text-center text-[#115a88]">Please login first.</div>
  );

  const prompts = await getPromptsByCreators(user.id);
  const totalPrompts = prompts ? prompts.length : 0;

  const roleColor = {
    admin: 'bg-red-50 text-red-700 border-red-200',
    creator: 'bg-purple-50 text-purple-700 border-purple-200',
    explorer: 'bg-blue-50 text-blue-700 border-blue-200',
  }[user.role?.toLowerCase()] || 'bg-gray-50 text-gray-500 border-gray-200';

  return (
    <>
      <style>{`
        @keyframes shimmer-move {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bar-fill {
          from { width: 0%; }
          to { width: var(--bar-w); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #115a88 0%, #1a7abf 40%, #93c5e8 60%, #115a88 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-move 3.5s linear infinite;
        }
        .accent-strip {
          background: linear-gradient(90deg, #115a88, #C7DFEA, #115a88);
          background-size: 200% auto;
          animation: shimmer-move 4s linear infinite;
        }
        .premium-bg {
          background: linear-gradient(135deg, #0d4a74 0%, #115a88 50%, #1568a0 100%);
        }
        .crown-float { animation: float 2.8s ease-in-out infinite; }
        .card-a { animation: fade-up 0.5s ease both; animation-delay: 0ms; }
        .card-b { animation: fade-up 0.5s ease both; animation-delay: 100ms; }
        .card-c { animation: fade-up 0.5s ease both; animation-delay: 200ms; }
        .stat-bar {
          animation: bar-fill 1.4s cubic-bezier(0.4,0,0.2,1) forwards;
          animation-delay: 400ms;
          width: 0%;
        }
        .card-lift { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .card-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(17,90,136,0.1); }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-text, .accent-strip, .premium-bg, .crown-float { animation: none !important; }
          .card-a, .card-b, .card-c { animation: none !important; }
          .stat-bar { animation: none !important; width: var(--bar-w) !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto py-2 space-y-4">

        {/* ── Hero Card ── */}
        <div className="card-a card-lift bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="accent-strip h-1.5 w-full" />
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#115a88] shadow-sm">
                <Image
                  src={user.image}
                  alt={user.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className={`absolute -bottom-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-lg border bg-white shadow-sm ${roleColor}`}>
                {user.role || 'Member'}
              </span>
            </div>

            {/* Name / Email */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#115a88] opacity-50 mb-1">NexPrompt Account</p>
              <h1 className="text-2xl sm:text-3xl font-bold shimmer-text leading-tight">{user.name}</h1>
              <p className="mt-1.5 text-sm text-gray-400 flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail size={13} className="text-[#115a88] opacity-50" />
                {user.email}
              </p>
              <div className="mt-4 inline-flex items-center gap-2">
                {user.plan === 'premium' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
                    <Crown size={11} /> Premium
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-[#f3f7fb] border border-gray-200 rounded-xl text-xs font-semibold text-gray-400">
                    <Shield size={11} /> Free Plan
                  </span>
                )}
              </div>
            </div>

            {/* Prompt count pill — desktop */}
            <div className="hidden sm:flex flex-col items-center justify-center bg-[#f3f7fb] rounded-2xl border border-gray-100 px-6 py-4 min-w-[88px] text-center">
              <span className="text-3xl font-bold text-[#115a88]">{totalPrompts}</span>
              <span className="text-xs text-gray-400 mt-0.5 leading-tight">Prompts<br />Created</span>
            </div>
          </div>
        </div>

        {/* ── Details + CTA Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Account Details */}
          <div className="card-b card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <p className="text-xs font-bold text-[#115a88] tracking-widest uppercase opacity-50 mb-5">Account Details</p>

            <div className="space-y-5">
              {/* Prompts bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Package size={13} className="text-[#115a88]" /> Prompts Created
                  </span>
                  <span className="text-lg font-bold text-[#115a88]">{totalPrompts}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full stat-bar"
                    style={{
                      '--bar-w': `${Math.min((totalPrompts / 20) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #115a88, #C7DFEA)'
                    }}
                  />
                </div>
              </div>

              {/* Plan */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Shield size={13} className="text-[#115a88]" /> Subscription
                </span>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${user.plan === 'premium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {user.plan === 'premium' ? '✦ Premium' : 'Free'}
                </span>
              </div>

              {/* Role */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Shield size={13} className="text-[#115a88]" /> Role
                </span>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${roleColor}`}>
                  {user.role || 'Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Upgrade CTA or Premium Status */}
          {user.plan !== 'premium' ? (
            <div className="card-c card-lift premium-bg rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm overflow-hidden relative">
              {/* decorative blobs */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white opacity-5 pointer-events-none" />
              <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full bg-white opacity-5 pointer-events-none" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown size={26} className="text-yellow-300 crown-float" />
                  <p className="text-xs font-bold tracking-widest uppercase opacity-60">Go Premium</p>
                </div>
                <h3 className="text-xl font-bold mb-2 leading-snug">Unlock All<br />Features</h3>
                <p className="text-sm text-[#C7DFEA] leading-relaxed mb-6">
                  Unlimited prompts, priority support, and exclusive creator tools.
                </p>
              </div>

              <Link
                href="/payment"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#115a88] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#f3f7fb] transition-colors w-full"
              >
                <Sparkles size={13} /> Upgrade Now <ChevronRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="card-c card-lift bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-6 flex flex-col justify-center items-center text-center">
              <Crown size={36} className="text-amber-500 crown-float mb-3" />
              <h3 className="text-lg font-bold text-amber-800 mb-1">Premium Member</h3>
              <p className="text-sm text-amber-600">You have full access to all NexPrompt features.</p>
            </div>
          )}
        </div>

        {/* Mobile-only prompts pill */}
        <div className="sm:hidden card-b card-lift bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#f3f7fb] flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-[#115a88]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#115a88]">{totalPrompts}</p>
            <p className="text-xs text-gray-400">Total Prompts Created</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default ProfilePage;