import { useEffect, useState } from "react";
import { getMenuById } from "../api/menuApi";

export const useGetMenuById = (itemId: string | null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await getMenuById(itemId);

        console.log("📥 FULL MENU DATA:", res);

        setMenu(res?.data || null);
      } catch (err) {
        console.error("❌ Failed to fetch menu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [itemId]);

  return { menu, loading };
};