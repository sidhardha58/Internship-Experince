/* eslint-disable @typescript-eslint/no-explicit-any */
import PlanCard from "./PlanCard";
import { X } from "lucide-react";
import { useSubscription } from "../../../hooks/useSubscriptions";

const formatName = (name: string) =>
  name.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const PlansModal = ({ onClose }: { onClose: () => void }) => {
  const { plans, loading } = useSubscription();
  console.log("Plans:" , plans);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Choose Subscription Plan
          </h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-3 gap-6 p-8">
          {plans.map((plan: any) => {
            const duration = `${plan.count} Months`;
            const total = `₹${plan.price * plan.count}`;
            const yearly = `₹${plan.price * 12}/year`;

            // 🔥 smart tags
            const isPopular = plan.count === 6;
            const isBest = plan.count === 12;

            return (
              <PlanCard
                key={plan.id}
                plan={{
                  id: plan.id,
                  name: formatName(plan.name),
                  duration,
                  total,
                  price: `₹${plan.price}`,
                  yearly,
                  popular: isPopular,
                  best: isBest,
                  features: [
                    "TDS Filing Support",
                    "Priority Support",
                    "Monthly Reports",
                  ],
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlansModal;