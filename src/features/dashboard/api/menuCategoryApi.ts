import axiosInstance from "../../../lib/axios";

type ServiceStyles = {
  buffet: {
    enabled: boolean;
  };
  sit_down: {
    enabled: boolean;
    extra_cost_per_person: number;
  };
};

export type CreateMenuCategoryPayload = {
  name: string;
  start_time: string;
  end_time: string;
  manage_bookings: number;
  stop_before: {
    value: number;
    unit: "hours" | "days";
  };
  service_styles?: ServiceStyles; // ✅ FIX ADDED
};

export const getMenuCategories = async () => {
  const res = await axiosInstance.get("/vendor-menu-categories");
  return res.data;
};

export const createMenuCategory = async (data: CreateMenuCategoryPayload) => {
  const res = await axiosInstance.post("/vendor-menu-categories", data);
  return res.data;
};

export const updateMenuCategory = async (
  id: string,
  data: Partial<CreateMenuCategoryPayload>,
) => {
  const res = await axiosInstance.put(`/vendor-menu-categories/${id}`, data);
  return res.data;
};
