import { Product } from "./products.interface";

export interface IProductItemProps {
  userType: string;
  product: Product;
  onDelete: () => void;
}
