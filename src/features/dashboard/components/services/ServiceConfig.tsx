import { useMemo, useState, useEffect } from "react";
import {
  Pencil,
  Clock,
  UtensilsCrossed,
  ConciergeBell,
  X,
  Users,
} from "lucide-react";

import { useMenuCategories } from "../../hooks/useMenuCategories";
import {
  createMenuCategory,
  updateMenuCategory,
} from "../../api/menuCategoryApi";

type Service = {
  id: number;
  name: string;
  items: number;
  active: boolean;
};

type Props = {
  selectedService: Service;
};

export default function ServiceConfig({ selectedService }: Props) {
  const { categories, fetchCategories } = useMenuCategories();

  const [isEdit, setIsEdit] = useState(false);

  const existingCategory = useMemo(() => {
    return categories.find(
      (cat) => cat.name.toLowerCase() === selectedService.name.toLowerCase(),
    );
  }, [categories, selectedService]);

  const getInitialForm = () => ({
    start_time: existingCategory?.start_time || "07:00",
    end_time: existingCategory?.end_time || "11:00",
    manage_bookings: existingCategory?.manage_bookings || 1,
  });

  const [form, setForm] = useState(getInitialForm);
  const [backupForm, setBackupForm] = useState(getInitialForm);

  const [styles, setStyles] = useState<string[]>(["buffet"]);
  const [sitDownCost, setSitDownCost] = useState<number>(0);

  useEffect(() => {
    const init = getInitialForm();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(init);
    setBackupForm(init);

    if (existingCategory?.service_styles) {
      const newStyles: string[] = [];

      if (existingCategory.service_styles.buffet?.enabled)
        newStyles.push("buffet");

      if (existingCategory.service_styles.sit_down?.enabled) {
        newStyles.push("sitdown");
        setSitDownCost(
          existingCategory.service_styles.sit_down.extra_cost_per_person || 0,
        );
      }

      setStyles(newStyles.length > 0 ? newStyles : ["buffet"]);
    } else {
      setStyles(["buffet"]);
    }
    // eslint-disable-next-line
  }, [selectedService, existingCategory]);

  const toggleStyle = (type: string) => {
    if (!isEdit) return;

    setStyles((prev) => {
      const updated = prev.includes(type)
        ? prev.filter((s) => s !== type)
        : [...prev, type];

      return updated.length === 0 ? ["buffet"] : updated;
    });
  };

  const preventWheelChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const handleSave = async () => {
    try {
      const safeStyles = styles.length === 0 ? ["buffet"] : styles;

      const payload = {
        name: selectedService.name,
        start_time: form.start_time,
        end_time: form.end_time,
        manage_bookings: form.manage_bookings,
        stop_before: {
          value: 4,
          unit: "days" as const,
        },
        service_styles: {
          buffet: {
            enabled: safeStyles.includes("buffet"),
          },
          sit_down: {
            enabled: safeStyles.includes("sitdown"),
            extra_cost_per_person: safeStyles.includes("sitdown")
              ? sitDownCost
              : 0,
          },
        },
      };

      if (existingCategory) {
        await updateMenuCategory(existingCategory._id, payload);
      } else {
        await createMenuCategory(payload);
      }

      await fetchCategories();

      setBackupForm(form);
      setIsEdit(false);
    } catch (err) {
      console.error("Failed to save category", err);
    }
  };

  const handleCancel = () => {
    setForm(backupForm);
    setIsEdit(false);
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 space-y-8 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Menu Settings</h2>
          <p className="text-sm text-gray-400">
            Configure availability and service styles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <X size={14} /> Cancel
            </button>
          )}

          <button
            onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg text-white transition shadow-sm
              ${
                isEdit
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            <Pencil size={14} />
            {isEdit ? "Save Changes" : "Edit"}
          </button>
        </div>
      </div>

      {/* NOTE */}
      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-xl p-4">
        <Clock size={16} className="mt-0.5" />
        <div>
          <span className="font-semibold">Note: </span>
          Customers must book this service at least{" "}
          <span className="font-medium">4 days in advance</span>.
        </div>
      </div>

      {/* FORM */}
      <div
        className={`space-y-8 transition ${
          !isEdit ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* TIME SECTION */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Service Timing
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <input
              type="time"
              value={form.start_time}
              onChange={(e) =>
                setForm((p) => ({ ...p, start_time: e.target.value }))
              }
              className="bg-gray-50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400"
            />

            <input
              type="time"
              value={form.end_time}
              onChange={(e) =>
                setForm((p) => ({ ...p, end_time: e.target.value }))
              }
              className="bg-gray-50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* CAPACITY */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Booking Capacity
          </h3>

          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <input
              type="number"
              value={form.manage_bookings}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  manage_bookings: Number(e.target.value),
                }))
              }
              onWheel={preventWheelChange}
              className="w-full bg-gray-50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* SERVICE STYLE */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Service Style
          </h3>

          <div className="flex gap-3">
            <div
              onClick={() => toggleStyle("buffet")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition
                ${
                  styles.includes("buffet")
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
            >
              <UtensilsCrossed size={14} />
              Buffet
            </div>

            <div
              onClick={() => toggleStyle("sitdown")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition
                ${
                  styles.includes("sitdown")
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
            >
              <ConciergeBell size={14} />
              Sit-down
            </div>
          </div>

          {/* EXTRA COST */}
          {styles.includes("sitdown") && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-1">
                Extra cost per person
              </p>
              <input
                type="number"
                value={sitDownCost}
                onChange={(e) => setSitDownCost(Number(e.target.value))}
                onWheel={preventWheelChange}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400"
                placeholder="Enter amount"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
