"use client";

import { useReducer, createContext, useEffect, useContext } from "react";
import requests from "../services/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Action,
  CartAction,
  CartItem,
  ContextType,
  Props,
  State,
} from "../types/context.types";

const initialState: State = {
  user: null,
  token: null,
};

const Context = createContext<ContextType>({
  state: initialState,
  dispatch: () => {},
  cartItems: [],
  cartDispatch: () => {},
});

export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within a Provider");
  }
  return context;
};

const rootReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload?.user,
        token: action.payload?.token,
      };
    case "LOGOUT":
      return { ...state, user: null, token: null };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload?.user,
        token: action.payload?.token,
      };
    default:
      return state;
  }
};

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  let updatedCart;

  switch (action.type) {
    case "ADD_ITEM":
      updatedCart = [...state, action.payload];
      localStorage.setItem(action.cartKey || "_tech_cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "REMOVE_ITEM":
      updatedCart = state.filter((item) => item.skuId !== action.payload?.skuId);
      localStorage.setItem(action.cartKey || "_tech_cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "UPDATE_CART":
      updatedCart = state.map((item) =>
        item.skuId === action.payload?.skuId ? action.payload : item
      );
      localStorage.setItem(action.cartKey || "_tech_cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "GET_CART_ITEMS":
      return action.payload;

    case "CLEAR_CART":
      localStorage.removeItem(action.cartKey || "_tech_cart");
      return [];

    default:
      return state;
  }
};


const Provider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [cartItems, cartDispatch] = useReducer(cartReducer, []);
  const router = useRouter();

  const cartKey = state.user ? `_tech_cart_${state.user.name}` : "_tech_cart";

  useEffect(() => {
    const storedUser = localStorage.getItem("_tech_user");
    const storedToken = localStorage.getItem("_tech_token");
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      dispatch({
        type: "LOGIN",
        payload: {
          token: storedToken ? storedToken : null,
          user: user,
        },
      });

      const storedCart = localStorage.getItem(cartKey);
      cartDispatch({
        type: "GET_CART_ITEMS",
        payload: storedCart ? JSON.parse(storedCart) : [],
        cartKey: cartKey,
      });
    }
  }, [cartKey]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          error.config &&
          !error.config.__isRetryRequest
        ) {
          return new Promise((resolve, reject) => {
            requests
              .put("/users/logout", {})
              .then(() => {
                console.log("/401 error > logout");
                dispatch({ type: "LOGOUT" });
                localStorage.removeItem(cartKey || "_tech_user");
                router.push("/auth");
              })
              .catch((err) => {
                console.log("AXIOS INTERCEPTORS ERR", err);
                reject(error);
              });
          });
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [router]);

  return (
    <Context.Provider value={{ state, dispatch, cartItems, cartDispatch }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
