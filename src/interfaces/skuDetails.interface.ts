import { Dispatch, SetStateAction } from "react";
import { SkuDetail } from "./products.interface";

export interface ISkuDetailsListProps {
  skuDetails: SkuDetail[] | [];
  setAllSkuDetails: Dispatch<SetStateAction<SkuDetail[]>>;
  productId: string;
}
