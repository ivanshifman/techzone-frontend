import requests, { ResponsePayload } from "./api";
import { IcartCheckoutDetails } from "../interfaces/cartCanvas.interface";

export const Orders = {
  checkoutSession: async (
    checkoutDetails: IcartCheckoutDetails[]
  ): Promise<ResponsePayload> => {
    const checkoutSessionRes = await requests.post("/orders/checkout", {
      checkoutDetails,
    });
    return checkoutSessionRes;
  },

  getAllOrders: async (status?: string): Promise<ResponsePayload> => {
    const findOrderRes = await requests.get(
      status ? `/orders?status=${status}` : `/orders`
    );
    return findOrderRes;
  },

  getOrder: async (orderId: string): Promise<ResponsePayload> => {
    const getOrderRes = await requests.get(`/orders/${orderId}`);
    return getOrderRes;
  },
};
