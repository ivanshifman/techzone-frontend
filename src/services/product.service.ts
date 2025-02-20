import requests, { ResponsePayload } from "./api";
import queryString from "query-string";
import { ProductFormType } from "../interfaces/products.interface";

export const Products = {
  getProducts: async (
    filter: Record<string, any>,
    serverSide: boolean = false,
    signal?: AbortSignal
  ): Promise<ResponsePayload> => {
    const url = queryString.stringifyUrl({
      url: serverSide ? "" : "/products",
      query: filter,
    });
    
    const getProductRes = signal
    ? await requests.getSignal<ResponsePayload>(url, signal)
    : await requests.get<ResponsePayload>(url);
    return getProductRes;
  },

  getProduct: async (id: string): Promise<ResponsePayload> => {
    const getProductRes = await requests.get<ResponsePayload>(
      `/products/${id}`
    );
    return getProductRes;
  },

  saveProduct: async (
    product: ProductFormType
  ): Promise<ResponsePayload> => {
    const saveProductRes = await requests.post<ResponsePayload>(
      "/products",
      product
    );
    return saveProductRes;
  },

  updateProduct: async (
    id: string,
    product: ProductFormType
  ): Promise<ResponsePayload> => {
    const updateProductRes = await requests.patch<ResponsePayload>(
      `/products/${id}`,
      product
    );
    return updateProductRes;
  },

  deleteProduct: async (id: string): Promise<ResponsePayload> => {
    const deleteProductRes = await requests.delete<ResponsePayload>(
      `/products/${id}`
    );
    return deleteProductRes;
  },

  uploadProductImage: async (
    id: string,
    image: any
  ): Promise<ResponsePayload> => {
    const uploadProductImageRes = await requests.post<ResponsePayload>(
      `/products/${id}/image`,
      image
    );
    return uploadProductImageRes;
  },

  addSku: async (
    productId: string,
    sku: Record<string, any>
  ): Promise<ResponsePayload> => {
    const addSkuRes = await requests.post<ResponsePayload>(
      `/products/${productId}/skus`,
      sku
    );
    return addSkuRes;
  },

  updateSku: async (
    productId: string,
    skuId: string,
    sku: Record<string, any>
  ): Promise<ResponsePayload> => {
    const updateSkuRes = await requests.put<ResponsePayload>(
      `/products/${productId}/skus/${skuId}`,
      sku
    );
    return updateSkuRes;
  },

  deleteSku: async (
    productId: string,
    skuId: string
  ): Promise<ResponsePayload> => {
    const deleteSkuRes = await requests.delete<ResponsePayload>(
      `/products/${productId}/skus/${skuId}`
    );
    return deleteSkuRes;
  },

  getLicenses: async (
    productId: string,
    skuId: string
  ): Promise<ResponsePayload> => {
    const getLicensesRes = await requests.get<ResponsePayload>(
      `/products/${productId}/skus/${skuId}/licenses`
    );
    return getLicensesRes;
  },

  addLicense: async (
    productId: string,
    skuId: string,
    license: Record<string, any>
  ): Promise<ResponsePayload> => {
    const addLicenseRes = await requests.post<ResponsePayload>(
      `/products/${productId}/skus/${skuId}/licenses`,
      license
    );
    return addLicenseRes;
  },

  updateLicense: async (
    productId: string,
    skuId: string,
    licenseId: string,
    license: Record<string, any>
  ): Promise<ResponsePayload> => {
    const updateLicenseRes = await requests.put<ResponsePayload>(
      `/products/${productId}/skus/${skuId}/licenses/${licenseId}`,
      license
    );
    return updateLicenseRes;
  },

  deleteLicense: async (licenseId: string): Promise<ResponsePayload> => {
    const deleteLicenseRes = await requests.delete<ResponsePayload>(
      `/products/licenses/${licenseId}`
    );
    return deleteLicenseRes;
  },

  addReview: async (
    productId: string,
    review: Record<string, any>
  ): Promise<ResponsePayload> => {
    const addReviewRes = await requests.post<ResponsePayload>(
      `/products/${productId}/reviews`,
      review
    );
    return addReviewRes;
  },

  deleteReview: async (
    productId: string,
    reviewId: string
  ): Promise<ResponsePayload> => {
    const addLicenseRes = await requests.delete<ResponsePayload>(
      `/products/${productId}/reviews/${reviewId}`
    );
    return addLicenseRes;
  },
};
