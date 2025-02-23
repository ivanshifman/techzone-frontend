export type Props = {
  children: React.ReactNode;
};

export type User = {
  name: string;
  email: string;
  type: string;
} | null;

export type Token = string | null;

export type State = {
  user: User;
  token: Token;
};

export type Action =
  | { type: "LOGIN"; payload: { user: User; token: Token } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: { user: User; token: Token } };

  interface CartItem {
    skuId: string;
    quantity: number;
    validity?: number;
    lifetime: boolean;
    price: number;
    productName: string;
    productImage: string;
    productId: string;
    skuPriceId: string;
  }

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { skuId: string } }
  | { type: "UPDATE_CART"; payload: CartItem }
  | { type: "GET_CART_ITEMS"; payload: CartItem[] }
  | { type: "CLEAR_CART" };


export type ContextType = {
  state: State;
  dispatch: (action: Action) => void;
  cartItems: CartItem[];
  cartDispatch: (action: CartAction) => void;
};
