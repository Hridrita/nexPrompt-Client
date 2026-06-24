
import { getPromptsByCreators } from '@/lib/api/prompts';
import { getUserSession } from '@/lib/core/session';
import { Crown, Mail, User, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const ProfilePage = async () => {
  const user = await getUserSession();
  if (!user) return <div className="p-8 text-center text-[#115a88]">Please login first.</div>;

  const prompts = await getPromptsByCreators(user.id);
  const totalPrompts = prompts ? prompts.length : 0;

  return (
    <div className="max-w-4xl mx-auto py-2 animate-in fade-in duration-700">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 mb-6">
        <img 
          src={user.image} 
          alt={user.name} 
          className="w-28 h-28 rounded-3xl border-4 border-[#f3f7fb] object-cover shadow-inner"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#115a88]">{user.name.toUpperCase()}</h1>
          <p className="text-[#185FA5] flex items-center gap-2 justify-center md:justify-start mt-1 font-medium">
            <Mail size={16} /> {user.email}
          </p>
          <div className="mt-4 flex gap-2 justify-center md:justify-start">
             <span className="px-3 py-1 bg-[#f3f7fb] text-[#115a88] text-xs font-bold rounded-lg uppercase tracking-wider">
               {user.role || 'Member'}
             </span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Info Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-[#115a88] uppercase tracking-widest mb-6">Account Details</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total Prompts Created</span>
              <span className="text-xl font-bold text-gray-800">{totalPrompts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Subscription Plan</span>
              <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase ${user.plan === 'premium' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                {user.plan || 'Free'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Card (Upgrade Section) */}
        {user.plan !== 'premium' && (
          <div className="bg-[#115a88] p-6 rounded-3xl text-white flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition-all">
            <Crown size={40} className="mb-3 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
            <p className="text-sm text-[#e2f0f8] mb-6 max-w-xs">Get unlimited access to all features and priority support.</p>
            <Link 
              href="/payment"
              className="bg-white text-[#115a88] px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;