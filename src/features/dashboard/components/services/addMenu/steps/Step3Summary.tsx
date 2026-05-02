import type { MenuData } from "../../../../types/menu.types";

export default function Step3Summary({ menuData }: { menuData: MenuData }) {
  // 🧠 VALIDATION
  const validate = () => {
    if (!menuData.name) return "Menu name is required";
    if (menuData.sections.length === 0) return "Add at least one section";

    for (const section of menuData.sections) {
      if (!section.name) return "All sections must have names";
      if (section.items.length === 0)
        return `Section "${section.name}" has no items`;

      for (const item of section.items) {
        if (!item.name) return `Item missing name in section "${section.name}"`;
      }
    }

    return null;
  };

  const error = validate();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Summary</h3>
        <p className="text-sm text-slate-500">Review your menu before saving</p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* MENU INFO */}
      <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
          Menu Info
        </h4>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
          <p>
            <span className="text-slate-400">Name</span>
            <br />
            {menuData.name}
          </p>

          <p>
            <span className="text-slate-400">Type</span>
            <br />
            {menuData.type}
          </p>

          <p>
            <span className="text-slate-400">Price</span>
            <br />₹{menuData.price/100}
          </p>

          <p>
            <span className="text-slate-400">Members</span>
            <br />
            {menuData.minMembers} - {menuData.maxMembers}
          </p>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="space-y-4">
        {menuData.sections.map((section, sIndex) => (
          <div
            key={sIndex}
            className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 space-y-4"
          >
            {/* SECTION HEADER */}
            <div>
              <h4 className="font-semibold text-slate-900">{section.name}</h4>

              <p className="text-xs text-slate-500 mt-1">
                {section.selectionType === "all"
                  ? "All items included"
                  : `Select up to ${section.selection_amount}`}
              </p>
            </div>

            {/* ITEMS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {section.items.map((item, iIndex) => (
                <div
                  key={iIndex}
                  className="bg-slate-50 rounded-xl p-3 hover:bg-slate-100 transition"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {item.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SUCCESS */}
      {!error && (
        <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-2xl text-sm">
          Ready to save menu
        </div>
      )}
    </div>
  );
}
