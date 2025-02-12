"use client";

import { useReducer, createContext, useEffect } from "react";
import requests from "../services/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Action, ContextType, Props, State } from "../types/context";

const initialState: State = {
  user: null,
  token: null,
};

const initialContext: ContextType = {
  state: initialState,
  dispatch: () => {},
  cartItems: [],
  cartDispatch: () => {},
};

const Context = createContext<ContextType>(initialContext);

const rootReducer = (state: Record<string, any>, action: Action) => {
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

const cartReducer = (state: any, action: Action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const cartItems = [...state, action.payload];
      window.localStorage.setItem("_tech_cart", JSON.stringify(cartItems));
      return cartItems;
    case "REMOVE_FROM_CART":
      const newCartItems = state.filter(
        (item: { skuId: string }) => item.skuId !== action.payload?.skuId
      );
      window.localStorage.setItem("_tech_cart", JSON.stringify(newCartItems));
      return newCartItems;
    case "UPDATE_CART":
      const updatedCartItems = state.map((item: any) => {
        if (item.skuId === action.payload?.skuId) {
          return action.payload;
        }
        return item;
      });
      window.localStorage.setItem(
        "_tech_cart",
        JSON.stringify(updatedCartItems)
      );
      return updatedCartItems;
    case "GET_CART_ITEMS":
      return action.payload;
    case "CLEAR_CART":
      window.localStorage.removeItem("_tech_cart");
      return [];
    default:
      return state;
  }
};

const Provider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [cartItems, cartDispatch] = useReducer(cartReducer, []);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("_tech_user");
    const storedToken = localStorage.getItem("_tech_token");
    if (storedUser && storedToken) {
      dispatch({
        type: "LOGIN",
        payload: {
          token: storedToken ? storedToken : null,
          user: storedUser ? JSON.parse(storedUser) : null,
        },
      });
    }

    const storedCart = localStorage.getItem("_tech_cart");
    cartDispatch({
      type: "GET_CART_ITEMS",
      payload: storedCart ? JSON.parse(storedCart) : [],
    });

    // const getCsrfToken = async () => {
    //   try {
    //     const { success, message, result }: ResponsePayload = await requests.get("/csrf-token");
    //     const csrfToken = result;

    //     if (!csrfToken || typeof csrfToken !== "string") {
    //       throw new Error("CSRF Token not found or invalid");
    //     }

    //     axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    //     console.log("CSRF Token:", csrfToken);
    //     console.log('CSRF Token', csrfToken, axios.defaults.headers);
    //   } catch (error) {
    //     console.error("Error fetching CSRF token:", error);
    //   }
    // };
    // getCsrfToken();
  }, []);

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
                dispatch({ type: "LOGOUT", payload: undefined });
                localStorage.removeItem("_tech_user");
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
