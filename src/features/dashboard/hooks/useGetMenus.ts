/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getMenus } from "../api/menuApi";

export const useGetMenus = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMenus();

      console.log("📦 MENUS RESPONSE:", res);

      setMenus(res?.data || []);
    } catch (err: any) {
      console.error("❌ GET MENUS ERROR:", err);
      setError(err?.message || "Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return {
    menus,
    loading,
    error,
    refetch: fetchMenus,
  };
};