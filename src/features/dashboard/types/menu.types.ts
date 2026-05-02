export type MenuItem = {
  name: string;
  description: string;
  image: File | null;
  imagePreview: string;
};

/* =========================
   UI LAYER (FRONTEND STATE)
========================= */
export type UISelectionType = "all" | "limited";

export type Section = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maxSelectable: any;
  name: string;
  selectionType: UISelectionType;

  // only used when "limited"
  selection_amount?: number;

  items: MenuItem[];
};

/* =========================
   MAIN MENU STATE (FRONTEND)
========================= */
export type MenuData = {
  menuCategoryId: string;
  name: string;
  type: "veg" | "nonveg";
  price: number;
  minMembers: number;
  maxMembers: number;

  image: File | null;
  imagePreview: string;

  sections: Section[];
};

/* =========================
   API LAYER (BACKEND FORMAT)
========================= */
export type ApiSelectionType = "include-all" | "custom-select";

export type ApiSection = {
  name: string;
  selection_type: ApiSelectionType;
  selection_amount: number;
};
