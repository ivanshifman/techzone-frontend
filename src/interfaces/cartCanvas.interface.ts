import { CartItem } from "../types/context.types";

export interface ICartOffCanvasProps {
  show: boolean;
  setShow: (show: boolean) => void;
  items: CartItem[];
}

export interface ICartItemsProps {
  rmvdeleteBtn?: boolean;
}

export interface IcartCheckoutDetails {
  skuPriceId: string;
  quantity: number;
  skuId: string;
}
