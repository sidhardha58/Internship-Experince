import { useEffect, useState } from "react";
import { getMenuCategories, createMenuCategory } from "../api/menuCategoryApi";

// ✅ TYPES
type ServiceStyles = {
  buffet: {
    enabled: boolean;
  };
  sit_down: {
    enabled: boolean;
    extra_cost_per_person: number;
  };
};

export type MenuCategory = {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
  manage_bookings: number;
  stop_before: {
    value: number;
    unit: "hours" | "days";
  };
  service_styles?: ServiceStyles;
};

// ✅ CREATE PAYLOAD TYPE (important fix)
export type CreateMenuCategoryPayload = {
  name: string;
  start_time: string;
  end_time: string;
  manage_bookings: number;
  stop_before: {
    value: number;
    unit: "hours" | "days";
  };
  service_styles?: ServiceStyles;
};

export const useMenuCategories = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getMenuCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED (now supports service_styles)
  const addCategory = async (payload: CreateMenuCategoryPayload) => {
    try {
      const res = await createMenuCategory(payload);
      setCategories((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to create category", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, fetchCategories, addCategory };
};
