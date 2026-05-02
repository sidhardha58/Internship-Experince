import { Check } from "lucide-react";
import { useState } from "react";
import { createSubscription } from "../../../api/settingsApi";
import toast from "react-hot-toast";

type Plan = {
  id: string; // 🔥 IMPORTANT (needed for API)
  name: string;
  duration: string;
  total: string;
  price: string;
  yearly: string;
  save?: string;
  features: string[];
  popular?: boolean;
  best?: boolean;
  current?: boolean;
};

const PlanCard = ({ plan }: { plan: Plan }) => {
  const [loading, setLoading] = useState(false);

  /* ================= SUBSCRIBE ================= */
  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const res = await createSubscription(plan.id);

      if (!res?.short_url) {
        throw new Error("Invalid subscription response");
      }

      // ✅ Open Razorpay in new tab
      window.open(res.short_url, "_blank");

      toast.success("Complete payment in opened tab");
    } catch (err) {
      console.error(err);
      toast.error("Failed to start subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-300
      ${
        plan.popular
          ? "bg-linear-to-b from-indigo-50 to-white shadow-lg ring-1 ring-indigo-100"
          : plan.best
            ? "bg-linear-to-b from-yellow-50 to-white shadow-lg ring-1 ring-yellow-200"
            : "bg-linear-to-b from-blue-50 to-white shadow-md ring-1 ring-gray-100"
      }`}
    >
      {/* Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow">
            Most Popular
          </span>
        </div>
      )}

      {plan.best && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white shadow">
            Best Value
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-center text-lg font-semibold text-gray-800">
        {plan.name}
      </h3>

      {/* Subtitle */}
      <p className="mt-1 text-center text-sm text-gray-500">
        {plan.duration} • Total {plan.total}
      </p>

      {/* Price */}
      <div className="mt-4 text-center">
        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
        <span className="ml-1 text-sm text-gray-500">/mo</span>
      </div>

      {/* Yearly */}
      <div className="mt-2 text-center text-sm">
        <span className="text-gray-400 line-through">{plan.yearly}</span>

        {plan.save && (
          <span className="ml-2 font-medium text-emerald-600">{plan.save}</span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-5">
        {plan.current ? (
          <button className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
            Current Active Plan
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Choose Plan"}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-gray-100" />

      {/* Benefits */}
      <div>
        <p className="mb-3 text-xs font-semibold text-gray-400 tracking-wide">
          BENEFITS
        </p>

        <ul className="space-y-2 text-sm text-gray-600">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check size={16} className="text-emerald-500" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
