import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import axiosInstance from "../../../lib/axios";

const SubscriptionSuccessPage = () => {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscription, setSubscription] = useState<any>(null);

  const fetchSubscription = async () => {
    try {
      const res = await axiosInstance.get("/subscriptions/my-subscription");

      setSubscription(res.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ⏳ small delay to allow webhook to update DB
    const timer = setTimeout(() => {
      fetchSubscription();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
          <p className="text-gray-600 font-medium">
            Confirming your subscription...
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Please wait while we verify your payment
          </p>
        </div>
      </div>
    );
  }

  /* ================= NO DATA / PENDING ================= */
  if (!subscription) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Loader2 className="animate-spin text-yellow-500 mx-auto mb-4" size={40} />
          <h2 className="text-lg font-semibold text-gray-800">
            Payment Processing
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Your payment is being processed. This may take a few seconds.
          </p>
        </div>
      </div>
    );
  }

  /* ================= SUCCESS ================= */
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />

        <h2 className="text-xl font-semibold text-gray-800">
          Subscription Activated 🎉
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          Your plan is now active and ready to use.
        </p>

        {/* PLAN INFO */}
        <div className="mt-6 text-left bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Plan</p>
          <p className="font-medium text-gray-800">
            {subscription.plan_name || "Active Plan"}
          </p>

          <div className="mt-3">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-green-600 font-medium capitalize">
              {subscription.status}
            </p>
          </div>

          {subscription.current_end && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">Next Billing</p>
              <p className="text-gray-800">
                {new Date(subscription.current_end).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;