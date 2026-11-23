
import { useContext } from "react";
import { CartContext } from "../CartContext";

const useCarrito = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCarrito debe utilizarse dentro de un CartProvider"
    );
  }

  return context;
};

export default useCarrito;
