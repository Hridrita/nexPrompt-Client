import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { addSubscription } from "@/lib/action/subscription";
import { updateUserPlan } from "@/lib/action/user";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  const status = session.status;
  const customerEmail = session.customer_details.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    try {
      await addSubscription({
        email: customerEmail,
        plan: "premium",
        stripeSessionId: session_id,
      });

      await updateUserPlan({ 
        email: customerEmail, 
        plan: "premium" 
      });
    } catch (error) {
      console.error("API Call Error:", error);
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>

          {/* Content */}
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600 mb-8">
            Thank you for your purchase. Your premium access has been activated.
          </p>

          {/* Details Card */}
          <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100 text-sm text-slate-500">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail size={16} />
              <span>Confirmation sent to:</span>
            </div>
            <p className="font-semibold text-slate-800">{customerEmail}</p>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Return to Dashboard <ArrowRight size={20} />
          </Link>

          <p className="mt-6 text-xs text-slate-400">
            Need help? Contact{" "}
            <a
              href="mailto:support@nexprompt.com"
              className="underline hover:text-indigo-600"
            >
              support@nexprompt.com
            </a>
          </p>
        </div>
      </div>
    );
  }
}
