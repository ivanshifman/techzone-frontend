export type Props = {
  children: React.ReactNode;
};

export type State = {
  user: any | null;
};

export type Action = {
  type: string;
  payload?: Record<string, any>;
};

export type ContextType = {
  state: Record<string, any>;
  dispatch: (action: Action) => void;
  cartItems: any[];
  cartDispatch: (action: Action) => void;
};

