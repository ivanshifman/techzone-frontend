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

export interface ISkuDetailsLicenseProps {
  licensesListFor: string;
  setLicensesListFor: Dispatch<SetStateAction<string>>;
  productId: string;
}

export interface ISkuDetailsLicense {
  productId: string;
  skuId: string;
  licenseKey: string;
  _id: string;
  isSold?: boolean;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
}
