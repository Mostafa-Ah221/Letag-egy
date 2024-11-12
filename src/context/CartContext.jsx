import { createContext, useState, useEffect, useContext } from "react";

// Initialize Context
export const CartContext = createContext();

export  const CartContextProvider = ({ children }) => {
  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartDetails();
  }, []);

  // Fetch cart details
  const fetchCartDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://demo.leetag.com/api/cart/details", {
        method: "post",
        headers: { "Accept": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch cart details");

      const data = await response.json();
      setCartDetails(data);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل السلة");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add or update product in cart
  const addToCart = async (productId, quantity = 1) => {
    if (!productId || quantity < 1) {
      setError("بيانات المنتج غير صحيحة");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://demo.leetag.com/api/cart/details", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          products_ids: Array(quantity).fill(productId),
        }),
      });

      if (!response.ok) {
        throw new Error(`فشلت العملية بكود: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setCartDetails(data);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || "حدث خطأ أثناء إضافة المنتج إلى العربة";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://demo.leetag.com/api/cart/clear", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("فشلت عملية تفريغ السلة");
      }

      setCartDetails(null);
    } catch (error) {
      setError("حدث خطأ أثناء تفريغ السلة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartDetails,
        loading,
        error,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartData = () => useContext(CartContext);
