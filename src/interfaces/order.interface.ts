import { ISkuDetailsLicense } from "./skuDetails.interface";

interface IOrderItem {
  lifetime: boolean; 
  price: number;
  productId: string;
  productImage: string;
  productName: string;
  skuCode: string;
  stock: string | number;
  quantity: string | number; 
  licenses: ISkuDetailsLicense[];
}

interface ICustomerAddress {
  city: string;
  country: string;
  line1: string;
  line2: string | null;
  postal_code: number;
  state: string;
}

interface IPaymentInfo {
  paymentMethod: string;
  paymentIntentId: string;
  paymentDate: string;
  paymentAmount: number;
  paymentStatus: string;
}

export interface IOrder {
  _id: string;
  orderId: string;
  userId: string;
  customerAddress: ICustomerAddress;
  customerPhoneNumber: string;
  orderedItems: IOrderItem[];
  paymentInfo: IPaymentInfo;
  orderStatus: string;
  isOrderDelivered: boolean;
  checkoutSessionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderOne {
  _id: string;
  orderId: string;
  userId: string;
  customerAddress: ICustomerAddress;
  customerPhoneNumber: string;
  orderedItems: IOrderItem[]; 
  paymentInfo: IPaymentInfo;
  orderStatus: string;
  isOrderDelivered: boolean;
  checkoutSessionId: string;
  createdAt: string;
  updatedAt: string;
}

