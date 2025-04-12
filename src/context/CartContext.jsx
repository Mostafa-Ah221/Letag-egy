import { createContext, useContext, useMemo, useState } from "react";
import toast from 'react-hot-toast';
import { useLanguage } from "./LanguageContextPro";


const CartContext = createContext();

const showToast = (message, type = 'success') => {
  const getCSSVariable = (variableName) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};
  const primaryColor = getCSSVariable('--primary-color');

  toast[type](message, {
    iconTheme: {
      primary: primaryColor, 
      secondary: 'white', 
    },
    style: {
      borderRadius: '8px',
      background: '#fff',
      color: '#333',
      padding: '16px',
    },
  });
};

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { language } = useLanguage();

  const [wishList, setWishList] = useState(() => {
    const savedWishList = localStorage.getItem("wishList");
    return savedWishList ? JSON.parse(savedWishList) : [];
  });

  const addToCart = (product, quantity = 1) => {
  const updatedCart = [...cart];
  const existingProduct = updatedCart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    updatedCart.push({ ...product, quantity });
    showToast(language === 'ar' ? 'تم إضافة المنتج إلى السلة!' : 'Product added to cart!');
  }

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};


  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id!== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showToast(language === 'ar' ? 'تم إزالة المنتج من السلة!' : 'Product removed from cart!');

  }
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = useMemo(() => {
  return cart.reduce((total, item) => {
    const itemPrice =
      item.special_price && parseFloat(item.special_price) > 0
        ? parseFloat(item.special_price)
        : parseFloat(item.price);

    return total + itemPrice * item.quantity;
  }, 0).toFixed(2);
}, [cart]);

// /

  // Part of Wish List
  const addToWishList = (product) => {
    const updatedWishList = [...wishList];
    const existingProduct = updatedWishList.find((item) => item.id === product.id);
    if (!existingProduct) {
      updatedWishList.push(product);
    }
    setWishList(updatedWishList);
    localStorage.setItem("wishList", JSON.stringify(updatedWishList));
    showToast(language === 'ar' ? 'تم إضافة المنتج إلى قائمة المفضلة!' : 'Product added to wishlist!');

  };

  const removeFromWishList = (productId) => {
    const updatedWishList = wishList.filter((item) => item.id !== productId);
    setWishList(updatedWishList);
    localStorage.setItem("wishList", JSON.stringify(updatedWishList));
  };

  const clearWishList = () => {
    setWishList([]);
    localStorage.removeItem("wishList");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

const handleAddToWish = (product, isInWishList, setIsInWishList) => {
  if (isInWishList) {
    setWishList((prev) => {
      const updatedWishList = prev.filter((item) => item && item.id !== product.id);
      localStorage.setItem("wishList", JSON.stringify(updatedWishList));
       showToast(language === 'ar' ? 'تم إزالة المنتج من قائمة المفضلة!' : 'Product removed from wishlist!');
      return updatedWishList;
    });
    setIsInWishList(false);
  } else {
   
    setWishList((prev) => {
      const updatedWishList = [...prev, product];
      localStorage.setItem("wishList", JSON.stringify(updatedWishList));
         showToast(language === 'ar' ? 'تم إضافة المنتج إلى قائمة المفضلة!' : 'Product added to wishlist!');
      
      return updatedWishList;
    });
    setIsInWishList(true);
  }
};

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getTotalPrice,
        addToWishList,
        removeFromWishList,
        clearWishList,
        wishList,
        handleAddToWish,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
