/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AddMenuWizard from "./addMenu/AddMenuWizard";
import { useGetMenus } from "../../hooks/useGetMenus";
import MenuCard from "./MenuCard";

type Service = {
  id: string;
  name: string;
  items: number;
  active: boolean;
};

type Props = {
  selectedService: Service;
};

export default function MenuCatalog({ selectedService }: Props) {
  const [filter, setFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [showWizard, setShowWizard] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);

  const { menus, loading, error } = useGetMenus();

  /* =========================
     FILTER MENUS
  ========================= */
  const filteredMenus = menus
    .filter(
      (menu: any) =>
        menu?.category_specific_data?.menu_category === selectedService.id,
    )
    .filter((menu: any) => {
      const isVeg = menu?.category_specific_data?.is_veg;

      if (filter === "all") return true;
      if (filter === "veg") return isVeg;
      return !isVeg;
    });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedService.name} Menus
          </h3>
          <p className="text-sm text-gray-500">
            {filteredMenus.length} items available
          </p>
        </div>

        <button
          onClick={() => {
            if (!selectedService?.id) {
              alert("❌ Menu category missing");
              return;
            }
            setEditingMenu(null); // ✅ reset edit mode
            setShowWizard(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md transition"
        >
          + Add Menu
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("veg")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "veg"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Veg
        </button>

        <button
          onClick={() => setFilter("nonveg")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "nonveg"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Non-Veg
        </button>
      </div>

      {/* STATES */}
      {loading && (
        <div className="text-center text-gray-400">Loading menus...</div>
      )}

      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && filteredMenus.length === 0 && (
        <div className="text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl p-6 text-center">
          No menu items found for this category
        </div>
      )}

      {/* MENU CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMenus.map((menu: any) => (
          <MenuCard
            key={menu._id}
            menu={menu}
            onEdit={(menu) => {
              setEditingMenu(menu); // ✅ set edit data
              setShowWizard(true); // ✅ open wizard
            }}
          />
        ))}
      </div>

      {/* WIZARD */}
      {showWizard && (
        <AddMenuWizard
          onClose={() => {
            setShowWizard(false);
            setEditingMenu(null);
          }}
          menuCategoryId={selectedService.id}
          editData={editingMenu} // ✅ edit mode trigger
        />
      )}
    </div>
  );
}
