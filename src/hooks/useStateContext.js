import React, { createContext, useContext, useEffect, useState } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
  if (localStorage.getItem("context") === null)
    localStorage.setItem(
      "context",
      JSON.stringify({
        username: "",
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        profilePicture: "",
        faves: {},
        carts: {},
      })
    );
  return JSON.parse(localStorage.getItem("context"));
};

export default function useStateContext() {
  const { context, setContext } = useContext(stateContext);
  return {
    context,
    setContext: (obj) => {
      setContext({ ...context, ...obj });
    },
    resetContext: () => {
      localStorage.removeItem("context");
      setContext(getFreshContext());
    },
    addToFaves: (kitchenId, productId) => {
      const updatedFaves = {
        ...context.faves,
        [kitchenId]: [...(context.faves[kitchenId] || []), productId],
      };
      setContext({ ...context, faves: updatedFaves });
    },
    removeFromFaves: (kitchenId, productId) => {
      const updatedFaves = {
        ...context.faves,
        [kitchenId]: context.faves[kitchenId].filter((id) => id !== productId),
      };
      setContext({ ...context, faves: updatedFaves });
    },
    addToCart: (kitchenId, productId) => {
      const updatedCarts = {
        ...context.carts,
        [kitchenId]: [...(context.carts[kitchenId] || []), productId],
      };
      setContext({ ...context, carts: updatedCarts });
    },
    removeFromCart: (kitchenId, productId) => {
      const updatedCarts = {
        ...context.carts,
        [kitchenId]: context.carts[kitchenId].filter((id) => id !== productId),
      };
      setContext({ ...context, carts: updatedCarts });
    },
  };
}


export function ContextProvider({ children }) {
  const [context, setContext] = useState(getFreshContext());

  useEffect(() => {
    localStorage.setItem("context", JSON.stringify(context));
  }, [context]);

  return (
    <stateContext.Provider value={{ context, setContext }}>
      {children}
    </stateContext.Provider>
  );
}
