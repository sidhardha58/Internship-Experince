/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users, IndianRupee, Pencil, Settings } from "lucide-react";

type Props = {
  menu: any;
  onEdit?: (menu: any) => void;
};

export default function MenuCard({ menu, onEdit }: Props) {
  const isVeg = menu?.category_specific_data?.is_veg;
  const min = menu?.category_specific_data?.min_people ?? "-";
  const max = menu?.category_specific_data?.max_people ?? "-";

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      {/* IMAGE */}
      <div className="relative h-56 bg-gray-100">
        {menu.image_url?.url ? (
          <img
            src={menu.image_url.url}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* LIVE BADGE */}
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow">
          LIVE
        </span>

        {/* ACTION BUTTONS */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit?.(menu)}
            className="bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white transition"
          >
            <Pencil size={16} className="text-gray-700" />
          </button>
          <button className="bg-blue-600 p-2 rounded-full shadow hover:bg-blue-700 transition">
            <Settings size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        {/* NAME */}
        <h4 className="text-lg font-semibold text-gray-800">{menu.name}</h4>

        {/* INFO ROW */}
        <div className="flex items-center justify-between">
          {/* MEMBERS */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} />
            <span>
              min {min} - max {max}
            </span>
          </div>

          {/* VEG TAG */}
          <span
            className={`text-xs px-3 py-1 rounded-lg font-medium ${
              isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            {isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-dashed border-gray-200" />

        {/* PRICE BOX */}
        <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">Starting</div>

          <div className="flex items-center gap-1">
            <IndianRupee size={18} className="text-gray-800" />
            <span className="text-xl font-semibold text-gray-900">
              {(menu.price / 100).toFixed(0)}
            </span>
            <span className="text-sm text-gray-500">/ Person</span>
          </div>
        </div>
      </div>
    </div>
  );
}
