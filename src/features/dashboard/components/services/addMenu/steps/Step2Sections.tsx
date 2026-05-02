/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus, Utensils } from "lucide-react";

import SectionForm from "../components/section/SectionForm";
import SectionCard from "../components/section/SectionCard";

export default function Step2Sections({ menuData, setMenuData }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /* =========================
     ADD / UPDATE SECTION
  ========================= */
  const saveSection = (section: any) => {
    const safeSection = {
      // 🔥 KEEP EXISTING ID
      id:
        editingIndex !== null ? menuData.sections[editingIndex]?.id : undefined,

      name: section?.name || "Untitled Section",

      selectionType: section?.selectionType || "all",

      selection_amount:
        section?.selectionType === "limited"
          ? Number(section?.selection_amount ?? 1)
          : 0,

      // 🔥 KEEP ITEM IDs
      items: (section?.items || []).map((item: any, i: number) => ({
        id:
          editingIndex !== null
            ? menuData.sections[editingIndex]?.items?.[i]?.id
            : undefined,

        name: item.name,
        description: item.description || "",
        image: item.image || null,
        imagePreview: item.imagePreview || "",
      })),
    };

    const updated = [...(menuData.sections || [])];

    if (editingIndex !== null) {
      // 🔥 UPDATE
      updated[editingIndex] = safeSection;
    } else {
      // 🔥 ADD
      updated.push(safeSection);
    }

    setMenuData({
      ...menuData,
      sections: updated,
    });

    setIsAdding(false);
    setEditingIndex(null);
  };

  /* =========================
     EDIT SECTION
  ========================= */
  const editSection = (index: number) => {
    setEditingIndex(index);
    setIsAdding(true);
  };

  /* =========================
     DELETE SECTION
  ========================= */
  const deleteSection = (index: number) => {
    const updated = [...(menuData.sections || [])];
    updated.splice(index, 1);

    setMenuData({
      ...menuData,
      sections: updated,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
        <p className="text-sm text-gray-500">
          Organize your menu into structured food categories
        </p>
      </div>

      {/* EMPTY STATE */}
      {(!menuData.sections || menuData.sections.length === 0) && !isAdding && (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl bg-white shadow-sm">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-50 mb-4">
            <Utensils className="text-orange-500" size={28} />
          </div>

          <h3 className="text-gray-800 font-medium text-lg">No sections yet</h3>

          <p className="text-gray-500 text-sm mt-1 mb-6">
            Start by adding your first menu section
          </p>

          <button
            onClick={() => {
              setEditingIndex(null);
              setIsAdding(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black transition"
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {isAdding && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <SectionForm
            initialData={
              editingIndex !== null ? menuData.sections[editingIndex] : null
            }
            onSave={saveSection}
            onCancel={() => {
              setIsAdding(false);
              setEditingIndex(null);
            }}
          />
        </div>
      )}

      {/* SECTION LIST */}
      <div className="space-y-4">
        {(menuData.sections || []).map((section: any, index: number) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-1"
          >
            <SectionCard
              section={{
                name: section.name,
                selectionType: section.selectionType || "all",
                selection_amount: section.selection_amount ?? 0,
                items: section.items || [],
              }}
              onEdit={() => editSection(index)} // 🔥 NEW
              onDelete={() => deleteSection(index)}
            />
          </div>
        ))}
      </div>

      {/* ADD MORE */}
      {(menuData.sections || []).length > 0 && !isAdding && (
        <div className="pt-2">
          <button
            onClick={() => {
              setEditingIndex(null);
              setIsAdding(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-900 text-white hover:bg-black transition"
          >
            <Plus size={18} />
            Add Another Section
          </button>
        </div>
      )}
    </div>
  );
}
