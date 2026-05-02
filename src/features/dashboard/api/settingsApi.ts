import axiosInstance from "../../../lib/axios";

/* ---------------- PHONE UPDATE ---------------- */
export const updatePhoneNumber = async (token: string) => {
  const res = await axiosInstance.put("/vendor/profile/phone", {
    token,
  });

  return res.data;
};

/* ---------------- PASSWORD RESET ---------------- */
export const resetPassword = async (
  old_password: string,
  new_password: string,
) => {
  const res = await axiosInstance.post("/reset-password", {
    old_password,
    new_password,
  });

  return res.data;
};

/* ---------------- LOGOUT ALL ---------------- */
export const logoutAllSessions = async () => {
  const res = await axiosInstance.post("/auth/logout-all");
  return res.data;
};

/* ---------------- LOGIN SESSIONS ---------------- */
export const fetchLoginActivity = async () => {
  const res = await axiosInstance.get("/vendor/login-activity");
  return res.data.data;
};

/* ---------------- SUBSCRIPTION PLANS ---------------- */
export const getSubscriptionPlans = async () => {
  const res = await axiosInstance.get("/subscriptions/plans");
  console.log("API Response:", res.data);
  return res.data?.data || res.data || [];
};

/* ---------------- CREATE SUBSCRIPTION ---------------- */
export const createSubscription = async (planId: string) => {
  const res = await axiosInstance.post(`/subscriptions/create/${planId}`);
  return res.data;
};