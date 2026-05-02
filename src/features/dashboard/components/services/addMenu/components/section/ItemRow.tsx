import { Trash2, ImagePlus } from "lucide-react";
import type { MenuItem } from "../../../../../types/menu.types";

type Props = {
  item: MenuItem;
  onChange: (field: keyof MenuItem, value: string | File) => void;
  onRemove: () => void;
};

export default function ItemRow({ item, onChange, onRemove }: Props) {
  return (
    <div className="flex gap-4 items-start bg-slate-50 p-3 rounded-xl">
      {/* IMAGE */}
      <label className="w-16 h-16 bg-white rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
        {item.imagePreview ? (
          <img src={item.imagePreview} className="w-full h-full object-cover" />
        ) : (
          <ImagePlus size={18} className="text-gray-400" />
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange("image", file);
          }}
        />
      </label>

      {/* TEXT */}
      <div className="flex-1 space-y-2">
        <input
          value={item.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Item name"
          className="w-full bg-white px-3 py-2 rounded-lg"
        />

        <input
          value={item.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Description"
          className="w-full bg-white px-3 py-2 rounded-lg"
        />
      </div>

      {/* DELETE */}
      <button onClick={onRemove}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
