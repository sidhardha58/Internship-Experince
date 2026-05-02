import { useState, useEffect } from "react";
import { Plus, Layers, ChevronDown } from "lucide-react";
import ItemRow from "./ItemRow";

import type { Section, MenuItem } from "../../../../../types/menu.types";

type Props = {
  onSave: (data: Section) => void;
  onCancel: () => void;

  // 🔥 ADD THIS
  initialData?: Section | null;
};

export default function SectionForm({ onSave, onCancel, initialData }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"all" | "limit">("all");
  const [limit, setLimit] = useState<string>("");

  const [items, setItems] = useState<MenuItem[]>([]);

  /* =========================
     🔥 PREFILL FOR EDIT MODE
  ========================= */
  useEffect(() => {
    if (!initialData) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initialData.name || "");

    const isLimited = initialData.selectionType === "limited";

    setType(isLimited ? "limit" : "all");

    setLimit(
      isLimited && initialData.selection_amount
        ? String(initialData.selection_amount)
        : "",
    );

    setItems(initialData.items || []);
  }, [initialData]);

  /* =========================
     ITEMS HANDLING
  ========================= */
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        image: null,
        imagePreview: "",
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof MenuItem,
    value: string | File,
  ) => {
    setItems((prev) => {
      const updated = [...prev];

      if (field === "image" && value instanceof File) {
        updated[index] = {
          ...updated[index],
          image: value,
          imagePreview: URL.createObjectURL(value),
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }

      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* =========================
     VALIDATION
  ========================= */
  const parsedLimit = Number(limit);

  const isValid =
    name.trim() !== "" &&
    items.length > 0 &&
    items.every((i) => i.name.trim() !== "");

  /* =========================
     SAVE
  ========================= */
  const handleSave = () => {
    onSave({
      name,

      selectionType: type === "all" ? "all" : "limited",

      selection_amount: type === "limit" ? parsedLimit || 1 : 0,

      items,
    } as Section);
  };

  return (
    <div className="bg-white rounded-3xl p-6 space-y-8 shadow-sm ring-1 ring-slate-100">
      {/* HEADER */}
      <div className="flex items-center gap-3 text-slate-500">
        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
          <Layers size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold">
            {initialData ? "Edit Section" : "New Section"}
          </p>
          <p className="text-xs text-slate-400">
            Create a structured menu category
          </p>
        </div>
      </div>

      {/* NAME */}
      <div>
        <label className="text-xs font-semibold text-slate-500 ml-1">
          Section Name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-50 rounded-2xl px-5 py-3.5"
          placeholder="e.g. Starters"
        />
      </div>

      {/* TYPE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 ml-1">
            Selection Type
          </label>

          <div className="relative">
            <select
              value={type}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-slate-50 rounded-2xl px-5 py-3.5 appearance-none"
            >
              <option value="all">All items included</option>
              <option value="limit">Limited selection</option>
            </select>

            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {type === "limit" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 ml-1">
              Max selectable
            </label>

            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-slate-50 rounded-2xl px-5 py-3.5"
            />
          </div>
        )}
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <ItemRow
            key={i}
            item={item}
            onChange={(field, value) => updateItem(i, field, value)}
            onRemove={() => removeItem(i)}
          />
        ))}

        <button onClick={addItem} className="flex gap-2">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-3">
        <button onClick={onCancel}>Cancel</button>

        <button
          disabled={!isValid}
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-black text-white disabled:bg-gray-300"
        >
          {initialData ? "Update Section" : "Save Section"}
        </button>
      </div>
    </div>
  );
}
