import { Trash2, Pencil } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SectionCard({ section, onDelete, onEdit }: any) {
  return (
    <div
      className="group flex items-center justify-between p-4 rounded-2xl
      bg-white shadow-sm ring-1 ring-slate-100
      hover:shadow-md hover:-translate-y-px
      transition-all duration-200"
    >
      {/* LEFT */}
      <div className="space-y-1">
        <p className="font-semibold text-slate-900 text-sm">{section.name}</p>

        <p className="text-xs text-slate-500">
          {section.selectionType === "all"
            ? "All items included"
            : `Choose any ${section.selection_amount}`}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
        {/* EDIT */}
        <button
          onClick={onEdit}
          className="w-9 h-9 flex items-center justify-center rounded-xl
          bg-slate-50 hover:bg-slate-100 transition"
        >
          <Pencil size={16} className="text-slate-600" />
        </button>

        {/* DELETE */}
        <button
          onClick={onDelete}
          className="w-9 h-9 flex items-center justify-center rounded-xl
          bg-red-50 hover:bg-red-100 transition"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}
