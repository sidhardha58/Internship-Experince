import axiosInstance from "../../../lib/axios";

/* =========================
   🔧 COMMON HELPERS
========================= */
const buildCategoryData = ({
  type,
  minMembers,
  maxMembers,
  menuCategoryId,
}: {
  type: "veg" | "nonveg";
  minMembers: number;
  maxMembers: number;
  menuCategoryId: string;
}) => ({
  menu_category: menuCategoryId,
  is_veg: type === "veg",
  min_people: minMembers,
  max_people: maxMembers,
  event_type: "other",
});

/* =========================
   1️⃣ CREATE MENU
========================= */
export const createMenu = async ({
  name,
  type,
  price,
  minMembers,
  maxMembers,
  image,
  menuCategoryId,
}: {
  name: string;
  type: "veg" | "nonveg";
  price: number;
  minMembers: number;
  maxMembers: number;
  image: File | null;
  menuCategoryId: string;
}) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("price", String(price));

  if (!image) throw new Error("Image is required");
  formData.append("item_image", image);

  const categoryData = buildCategoryData({
    type,
    minMembers,
    maxMembers,
    menuCategoryId,
  });

  formData.append("category_specific_data", JSON.stringify(categoryData));

  console.log("🔥 CREATE MENU PAYLOAD:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const res = await axiosInstance.post("/vendor-items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/* =========================
   2️⃣ CREATE SECTION
========================= */
type SelectionType = "include-all" | "custom-select";

export const createSection = async (
  itemId: string,
  section: {
    name: string;
    selectionType: string;
    selection_amount?: number;
  },
) => {
  const normalize = (type: string): SelectionType =>
    type === "all" ? "include-all" : "custom-select";

  const selectionType = normalize(section.selectionType);

  const payload = {
    name: section.name,
    selection_type: selectionType,
    selection_amount:
      selectionType === "custom-select"
        ? Number(section.selection_amount ?? 1)
        : 0,
  };

  console.log("📦 CREATE SECTION:", payload);

  const res = await axiosInstance.post(
    `/vendor-items/${itemId}/food-category`,
    payload,
  );

  return res.data;
};

/* =========================
   3️⃣ CREATE MENU ITEM
========================= */
export const createMenuItem = async (
  itemId: string,
  categoryId: string,
  item: {
    name: string;
    description: string;
    image: File | null;
    isStockImage?: boolean;
  },
) => {
  const formData = new FormData();

  formData.append("name", item.name);
  formData.append("description", item.description);
  formData.append("is_stock_image", "false");

  if (!item.isStockImage && item.image) {
    formData.append("file", item.image);
  }

  console.log("📦 CREATE ITEM:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  // ✅ FIXED PATH (IMPORTANT)
  const res = await axiosInstance.put(
    `/vendor-items/${itemId}/menu-item/${categoryId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return res.data;
};

/* =========================
   4️⃣ GET ALL MENUS
========================= */
export const getMenus = async () => {
  const res = await axiosInstance.get("/vendor-items");
  return res.data;
};

/* =========================
   5️⃣ GET SINGLE MENU
========================= */
export const getMenuById = async (itemId: string) => {
  const res = await axiosInstance.get(`/vendor-items/${itemId}`);
  return res.data;
};

/* =========================
   6️⃣ UPDATE MENU (FIXED)
========================= */
export const updateMenu = async (
  itemId: string,
  {
    name,
    type,
    price,
    minMembers,
    maxMembers,
    image,
    menuCategoryId,
  }: {
    name: string;
    type: "veg" | "nonveg";
    price: number;
    minMembers: number;
    maxMembers: number;
    image: File | null;
    menuCategoryId: string;
  },
) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("price", String(price));

  if (image) {
    formData.append("item_image", image);
  }

  const categoryData = buildCategoryData({
    type,
    minMembers,
    maxMembers,
    menuCategoryId,
  });

  // 🔥 CRITICAL FIX
  formData.append("category_specific_data", JSON.stringify(categoryData));

  console.log("🛠 UPDATE MENU PAYLOAD:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const res = await axiosInstance.put(`/vendor-items/${itemId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/* =========================
   7️⃣ UPDATE SECTION
========================= */
export const updateSection = async (
  itemId: string,
  sectionId: string,
  section: {
    name: string;
    selectionType: string;
    selection_amount?: number;
  },
) => {
  const selectionType =
    section.selectionType === "all" ? "include-all" : "custom-select";

  const payload = {
    name: section.name,
    selection_type: selectionType,
    selection_amount:
      selectionType === "custom-select"
        ? Number(section.selection_amount ?? 1)
        : 0,
  };

  const res = await axiosInstance.put(
    `/vendor-items/${itemId}/food-category/${sectionId}`,
    payload,
  );

  return res.data;
};

/* =========================
   8️⃣ UPDATE MENU ITEM (FIXED PATH)
========================= */
export const updateMenuItem = async (
  itemId: string,
  categoryId: string,
  menuItemId: string,
  item: {
    name: string;
    description: string;
    image: File | null;
    isStockImage?: boolean;
  },
) => {
  const formData = new FormData();

  formData.append("name", item.name);
  formData.append("description", item.description);
  formData.append("is_stock_image", "false");

  if (!item.isStockImage && item.image) {
    formData.append("file", item.image);
  }

  const res = await axiosInstance.put(
    `/vendor-items/${itemId}/menu-item/${categoryId}/${menuItemId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return res.data;
};
