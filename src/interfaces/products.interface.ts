export interface SkuDetail {
  lifetime: boolean;
  price: number;
  skuCode: string;
  skuName: string;
  stock: number;
  stripePriceId: string;
  validity?: number;
  _id: string;
  updatedAt?: string;
}

interface FeedbackDetail {
  createdAt: string;
  customerId: string;
  customerName: string;
  feedbackMsg: string;
  rating: number;
  updatedAt: string;
  _id: string;
}

interface ImageDetails {
  api_key: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[] | [];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}

export interface Product {
  _id: string;
  baseType: string;
  category: string;
  createdAt: string;
  description: string;
  downloadUrl: string;
  feedbackDetails: FeedbackDetail[] | [];
  highlights: string[] | [];
  image: string;
  imageDetails?: ImageDetails;
  platformType: string;
  productName: string;
  productUrl: string;
  requirementSpecification: string[] | [];
  skuDetails: SkuDetail[] | [];
  stripeProductId: string;
  updatedAt: string;
  avgRating?: number;
}
