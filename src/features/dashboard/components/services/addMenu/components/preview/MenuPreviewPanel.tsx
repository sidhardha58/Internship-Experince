/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  step: number;
  menuData: any;
};

const GST_RATE = 0.18;

// ✅ ALWAYS ROUND UP
const calculateTotalPrice = (price: number) => {
  const gst = Math.ceil(price * GST_RATE);
  return Math.ceil(price + gst);
};

export default function MenuPreviewPanel({ step, menuData }: Props) {
  const totalPrice = calculateTotalPrice(menuData.price || 0);

  // 👉 STEP 2 → HOW IT WORKS
  if (step === 2) {
    return (
      <div className="w-[35%] bg-gray-50 border-r border-gray-200 p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-5 space-y-5">

          <p className="text-center text-sm font-semibold text-gray-500 tracking-wide">
            HOW IT WORKS
          </p>

          <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
            <img
              src="/Preview example.png"
              alt="Sections Example"
              className="rounded-lg shadow-sm object-contain"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Sections & Items
            </h3>

            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Sections</span> are menu categories like Starters, Main Course, Desserts.
            </p>

            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Items</span> are the actual food dishes inside each section.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // 👉 LIVE PREVIEW
  return (
    <div className="w-[35%] bg-gray-50 border-r border-gray-200 p-6 flex items-center justify-center">

      <div className="w-80 max-w-sm">

        <h3 className="text-xs font-semibold text-gray-500 mb-4 tracking-wide">
          LIVE PREVIEW
        </h3>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">

          {/* IMAGE */}
          <div className="h-60 bg-gray-100">
            {menuData.imagePreview ? (
              <img
                src={menuData.imagePreview}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-3">

            {/* NAME + TYPE */}
            <div className="flex items-start justify-between">

              <h4 className="text-base font-semibold text-gray-900">
                {menuData.name || "Menu Name"}
              </h4>

              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  menuData.type === "veg"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    menuData.type === "veg" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {menuData.type === "veg" ? "Veg" : "Non-Veg"}
              </div>

            </div>

            {/* ✅ PRICE WITH GST */}
            <div>
              <div className="text-sm font-semibold text-gray-900">
                ₹ {totalPrice/100} / Person
              </div>

              <div className="text-xs text-gray-400">
                incl. 18% GST
              </div>
            </div>

            {/* MEMBERS */}
            <div className="text-xs text-gray-500">
              👥 {menuData.minMembers || 0} - {menuData.maxMembers || 0} Guests
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}