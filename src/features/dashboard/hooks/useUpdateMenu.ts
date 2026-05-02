/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  createMenuItem,
  createSection,
  updateMenu,
  updateMenuItem,
  updateSection,
} from "../api/menuApi";

export const useUpdateMenu = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFullMenu = async (menuData: any, itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🛠 Updating Menu:", itemId);

      /* =========================
         1️⃣ UPDATE MENU
      ========================= */
      const menuRes = await updateMenu(itemId, {
        name: menuData.name,
        type: menuData.type,
        price: menuData.price,
        minMembers: menuData.minMembers,
        maxMembers: menuData.maxMembers,
        image: menuData.image,
        menuCategoryId: menuData.menuCategoryId,
      });

      console.log("✅ MENU UPDATED:", menuRes);

      /* =========================
         2️⃣ SECTIONS
      ========================= */
      for (const section of menuData.sections ?? []) {
        let sectionId = section.id;

        const sectionPayload: any = {
          name: section.name,
          selectionType:
            section.selectionType === "all" ? "include-all" : "custom-select",
        };

        if (section.selectionType === "limited") {
          sectionPayload.selection_amount = Number(
            section.selection_amount ?? 1,
          );
        }

        // UPDATE
        if (sectionId) {
          await updateSection(itemId, sectionId, sectionPayload);
        }
        // CREATE
        else {
          const sectionRes = await createSection(itemId, sectionPayload);
          sectionId = sectionRes?.data?.foodCategory?._id;
        }

        /* =========================
           3️⃣ ITEMS
        ========================= */
        for (const item of section.items ?? []) {
          const isNewImage =
            item.image && typeof item.image === "object" && item.image.name;

          const itemPayload: any = {
            name: item.name,
            description: item.description ?? "",
          };
          console.log(" ITEM DEBUG:", {
            name: item.name,
            id: item.id,
            sectionId,
          });
          if (isNewImage) {
            itemPayload.image = item.image;
          }

          // UPDATE ITEM
          if (item.id && item.id !== "temp") {
            await updateMenuItem(itemId, sectionId, item.id, itemPayload);
          }
          // CREATE ITEM
          else {
            await createMenuItem(itemId, sectionId, itemPayload);
          }
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error("🔥 UPDATE ERROR:", err);
      setError(err?.message || "Update failed");

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { updateFullMenu, loading, error };
};
