import { Dispatch, SetStateAction } from "react";
import { SkuDetail } from "./products.interface";

export interface ISkuDetailsListProps {
  skuDetails: SkuDetail[] | [];
  setAllSkuDetails: Dispatch<SetStateAction<SkuDetail[]>>;
  productId: string;
}

export interface ISkuDetailsFormProps {
  productId: string;
  setSkuDetailsFormShow: Dispatch<SetStateAction<boolean>>;
  allSkuDetails: SkuDetail[] | [];
  setAllSkuDetails: Dispatch<SetStateAction<SkuDetail[]>>;
  skuIdForUpdate: string;
  setSkuIdForUpdate: Dispatch<SetStateAction<string>>;
}