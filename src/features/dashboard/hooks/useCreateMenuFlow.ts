import { useState } from "react";
import { createMenu, createSection, createMenuItem } from "../api/menuApi";
import type { MenuData, UISelectionType } from "../types/menu.types";

/* =========================
   UI → API CONVERTER
========================= */
type ApiSelectionType = "include-all" | "custom-select";

const toApiSelectionType = (type: UISelectionType): ApiSelectionType => {
  return type === "all" ? "include-all" : "custom-select";
};

export const useCreateMenuFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFullMenu = async (menuData: MenuData) => {
    try {
      setLoading(true);
      setError(null);

      /* =========================
         1️⃣ CREATE MENU
      ========================= */
      const menuRes = await createMenu({
        name: menuData.name,
        type: menuData.type,
        price: menuData.price,
        minMembers: menuData.minMembers,
        maxMembers: menuData.maxMembers,
        image: menuData.image,
        menuCategoryId: menuData.menuCategoryId,
      });

      const itemId = menuRes?.data?._id;
      if (!itemId) throw new Error("Menu creation failed");

      console.log("✅ MENU CREATED:", itemId);

      /* =========================
         2️⃣ CREATE SECTIONS
      ========================= */
      for (const section of menuData.sections ?? []) {
        console.log("🚀 Creating section:", section.name);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sectionPayload: any = {
          name: section.name,
          selectionType: toApiSelectionType(section.selectionType), // ✅ FIXED
        };

        if (section.selectionType === "limited") {
          sectionPayload.selection_amount = Number(
            section.selection_amount ?? 1,
          );
        }

        const sectionRes = await createSection(itemId, sectionPayload);
        console.log("SECTION RESPONSE:", sectionRes);

        const sectionId = sectionRes?.data?.foodCategory?._id;
        if (!sectionId) {
          console.error("❌ SECTION ID NOT FOUND:", sectionRes);
          throw new Error(`Section failed: ${section.name}`);
        }

        console.log("✅ SECTION CREATED:", sectionId);

        /* =========================
           3️⃣ CREATE ITEMS
        ========================= */
        for (const item of section.items ?? []) {
          console.log("👉 Creating item:", item.name);

          // ✅ SAFE FILE CHECK (fix only)
          const isValidImage =
            item.image &&
            typeof item.image === "object" &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof (item.image as any).name === "string";

          if (!isValidImage) {
            console.error("❌ Invalid image for item:", item.name, item.image);
            throw new Error(`Invalid image for item: ${item.name}`);
          }

          const itemRes = await createMenuItem(itemId, sectionId, {
            name: item.name,
            description: item.description ?? "",
            image: item.image,
          });

          console.log("✅ ITEM RESPONSE:", itemRes);

          if (!itemRes?.success) {
            console.error("❌ ITEM ERROR:", itemRes);
            throw new Error(`Item failed: ${item.name}`);
          }
        }
      }

      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("🔥 FULL ERROR:", err);
      setError(err?.message || "Something went wrong");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { createFullMenu, loading, error };
};
