/* eslint-disable @typescript-eslint/no-explicit-any */
import requests, { ResponsePayload } from "./api";

export const Users = {
  getUser: async (id: string): Promise<ResponsePayload> =>
    requests.get(`/users/${id}`),

  getUsers: async (): Promise<ResponsePayload> =>
    requests.get("/users"),

  registerNewUser: async (user: any): Promise<ResponsePayload> =>
    requests.post("/users", { ...user, type: "customer" }),

  loginUser: async (user: any): Promise<ResponsePayload> => {
    const loginUserRes = await requests.post(
      "/users/login",
      user
    );
    window.localStorage.setItem(
      "_tech_user",
      JSON.stringify(loginUserRes.result?.user || {})
    );
    window.localStorage.setItem(
      "_tech_token",
      JSON.stringify(loginUserRes.result?.token || {})
    );
    return loginUserRes;
  },

  updateUser: async (user: any, id: string): Promise<ResponsePayload> => {
    const updateUserRes = await requests.patch(
      `/users/update-name-password/${id}`,
      user
    );
    const userData = JSON.parse(
      window.localStorage.getItem("_tech_user") || "{}"
    );
    const tokenData = JSON.parse(
      window.localStorage.getItem("_tech_token") || "{}"
    );
    userData.name = user?.name;
    window.localStorage.setItem("_tech_user", JSON.stringify(userData));
    window.localStorage.setItem("_tech_token", JSON.stringify(tokenData));
    return updateUserRes;
  },

  forgotUserPassword: async (email: string): Promise<ResponsePayload> =>
    requests.get(`/users/forgot-password/${email}`),

  resendOTP: async (email: string): Promise<ResponsePayload> =>
    requests.get(`/users/send-otp-email/${email}`),

  verifyOTP: async (otp: string, email: string): Promise<ResponsePayload> =>
    requests.get(`/users/verify-email/${otp}/${email}`),

  logoutUser: async (): Promise<ResponsePayload> => {
    const logoutUserRes = await requests.put(
      "/users/logout",
      {}
    );
    const storedUser = JSON.parse(
      window.localStorage.getItem("_tech_user") || "{}"
    );
    const cartKey = storedUser?.name
      ? `_tech_cart_${storedUser.name}`
      : "_tech_cart";
    window.localStorage.removeItem(cartKey);
    window.localStorage.removeItem("_tech_user");
    window.localStorage.removeItem("_tech_token");
    return logoutUserRes;
  },
};
