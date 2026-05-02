import { CheckCircle, Leaf, Ham } from "lucide-react";
import { useRef } from "react";
import type { MenuData } from "../../../../types/menu.types";

type Props = {
  menuData: MenuData;
  setMenuData: React.Dispatch<React.SetStateAction<MenuData>>;
};

export default function Step1MenuInfo({ menuData, setMenuData }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const GST_RATE = 0.18;

  const sanitizeNumber = (value: string) => {
    return value.replace(/^0+(?=\d)/, "");
  };

  const handleImageUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setMenuData({ ...menuData, image: file, imagePreview: previewUrl });
  };

  // =========================
  // GST CALCULATION (UI)
  // =========================
  const basePrice = menuData.price/100 || 0;
  const gstAmount = basePrice * GST_RATE;
  const totalPrice = basePrice + gstAmount;

  // =========================
  // FINAL PAYLOAD (BACKEND SAFE)
  // =========================
  const finalPayload = {
    ...menuData,
    pricing: {
      basePrice,
      gstRate: 18,
      gstAmount: Math.ceil(gstAmount),
      totalPrice: Math.ceil(totalPrice),
    },
  };

  console.log("Step1 👉", finalPayload);

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h3 className="text-lg font-semibold">Create New Menu</h3>
        <p className="text-sm text-gray-500">
          Create menu basics before adding food sections
        </p>
      </div>

      {/* MENU NAME */}
      <div>
        <label className="text-sm text-gray-500">Menu Name</label>
        <input
          type="text"
          placeholder="e.g. Standard Breakfast"
          value={menuData.name}
          onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
          className="mt-1 w-full rounded-xl bg-white/70 backdrop-blur border border-gray-100 shadow-sm px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition"
        />
      </div>

      {/* FOOD TYPE */}
      <div>
        <label className="text-sm text-gray-500">Food Type</label>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setMenuData({ ...menuData, type: "veg" })}
            className={`flex items-center gap-1 px-4 py-2 rounded-full border transition ${
              menuData.type === "veg"
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <Leaf className="w-4 h-4" /> Veg
          </button>

          <button
            onClick={() => setMenuData({ ...menuData, type: "nonveg" })}
            className={`flex items-center gap-1 px-4 py-2 rounded-full border transition ${
              menuData.type === "nonveg"
                ? "bg-red-600 text-white border-red-600"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <Ham className="w-4 h-4" /> Non-Veg
          </button>
        </div>
      </div>

      {/* PRICE */}
      <div>
        <label className="text-sm text-gray-500">Price Per Person</label>

        <div className="relative mt-1">
          <span className="absolute left-3 top-3 text-gray-500">₹</span>

          <input
            type="number"
            placeholder="e.g. 200"
            value={menuData.price === 0 ? "" : menuData.price/100}
            onChange={(e) =>
              setMenuData({
                ...menuData,
                price:
                  e.target.value === ""
                    ? 0
                    : Number(sanitizeNumber(e.target.value)),
              })
            }
            className="w-full rounded-xl bg-white/70 backdrop-blur border border-gray-100 shadow-sm px-3 py-3 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition"
          />
        </div>

        {/* GST CARD */}
        {menuData.price > 0 && (
          <div className="mt-5 rounded-2xl bg-linear-to-br from-blue-50/60 to-white shadow-sm p-5">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <CheckCircle className="w-4 h-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  GST Applied
                </p>
                <p className="text-xs text-gray-500">18% tax included</p>
              </div>
            </div>

            {/* BREAKDOWN */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Base Price</span>
                <span className="font-medium text-gray-900">
                  ₹ {basePrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span className="font-medium text-gray-900">
                  + ₹ {gstAmount.toFixed(2)}
                </span>
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

              <div className="flex justify-between items-end">
                <span className="font-semibold text-gray-800">Total Price</span>

                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ₹ {totalPrice.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Final payable amount
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MEMBERS */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">Min Members</label>
          <input
            type="number"
            value={menuData.minMembers === 0 ? "" : menuData.minMembers}
            onChange={(e) =>
              setMenuData({
                ...menuData,
                minMembers:
                  e.target.value === ""
                    ? 0
                    : Number(sanitizeNumber(e.target.value)),
              })
            }
            className="mt-1 w-full rounded-xl bg-white/70 backdrop-blur border border-gray-100 shadow-sm px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Max Members</label>
          <input
            type="number"
            value={menuData.maxMembers === 0 ? "" : menuData.maxMembers}
            onChange={(e) =>
              setMenuData({
                ...menuData,
                maxMembers:
                  e.target.value === ""
                    ? 0
                    : Number(sanitizeNumber(e.target.value)),
              })
            }
            className="mt-1 w-full rounded-xl bg-white/70 backdrop-blur border border-gray-100 shadow-sm px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition"
          />
        </div>
      </div>

      {/* IMAGE UPLOAD */}
      <div>
        <label className="text-sm text-gray-500">Menu Image</label>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 rounded-2xl bg-linear-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition cursor-pointer p-6 text-center border border-gray-100"
        >
          {menuData.image ? (
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-medium text-gray-800">
                📄 {menuData.image.name}
              </div>
              <div className="text-xs text-gray-400">Click to change image</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-medium text-gray-500">
                Upload Menu Image
              </div>
              <div className="text-xs text-gray-400">
                PNG, JPG or WebP (Max 5MB)
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
      </div>
    </div>
  );
}
