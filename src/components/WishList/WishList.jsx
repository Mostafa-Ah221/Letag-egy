import { FaHeartBroken, FaStar } from "react-icons/fa"; 
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";

import { useContext, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import Modal from "../Modal/Modal";
import LoadingIndicator from "../Loading/LoadingIndicator";
import { BiCart, BiCartAdd } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { HiMinus, HiOutlinePlusSmall } from "react-icons/hi2";

export default function WishList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
      const [visibilityState, setVisibilityState] = useState({});
    const timerRef = useRef({});
    const quantityRef = useRef(null);
   const { addToCart, handleAddToWish, wishList, cart, updateQuantity,removeFromCart } = useCart();

  const { language } = useLanguage(); 
  const { currencyData, getProdDetails } = useContext(ContextData);

  const ids = wishList.map((item) => item?.id).filter(Boolean);

  const { data: productsData, isError, isLoading } = useQuery({
    queryKey: ["getProdDetails", ids, language],
    queryFn: () => Promise.all(ids.map((id) => getProdDetails(id, language))),
    enabled: ids.length > 0,
  });
  
 const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };
const startTimer = (productId) => {
    if (timerRef.current[productId]) {
      clearTimeout(timerRef.current[productId]);
    }
    timerRef.current[productId] = setTimeout(() => {
      setVisibilityState(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          isVisible: false
        }
      }));
      setTimeout(() => {
        setVisibilityState(prev => ({
          ...prev,
          [productId]: {
            showQuantity: false,
            isVisible: false
          }
        }));
      }, 300);
    }, 3000);
  };

  const clearTimer = (productId) => {
    if (timerRef.current[productId]) {
      clearTimeout(timerRef.current[productId]);
      timerRef.current[productId] = null;
    }
  };

  useEffect(() => {
    return () => {
      // تنظيف كل المؤقتات عند إزالة المكون
      Object.values(timerRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

 const handleCartClick = (e, currentProduct) => {  
  e.preventDefault();
  addToCart(currentProduct, quantity);
  
  // تحديث حالة الرؤية للمنتج المحدد
  setVisibilityState(prev => ({
    ...prev,
    [currentProduct.id]: {
      showQuantity: true,
      isVisible: true
    }
  }));
  
  startTimer(currentProduct.id);
};

 const handleQuantityChange = (change, e, currentProduct) => {
  e.preventDefault();
  e.stopPropagation();
  const currentCartItem = cart.find((item) => item?.id === currentProduct?.id);
  const newQuantity = currentCartItem?.quantity + change;
  
  if (newQuantity >= 1) {
    updateQuantity(currentProduct?.id, newQuantity);
  } else if (newQuantity === 0) {
    removeFromCart(currentProduct?.id);
    // إعادة تعيين حالة الرؤية عند إزالة المنتج
    setVisibilityState(prev => ({
      ...prev,
      [currentProduct.id]: {
        showQuantity: false,
        isVisible: false
      }
    }));
  }
  clearTimer(currentProduct.id);
};
  
  const handleQuantityMouseEnter = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimer(productId);
  };

  const handleQuantityMouseLeave = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    startTimer(productId);
  };
 const handleProductClick = (product) => {
        const cartItem = cart.find((item) => item?.id === product?.id); 
        setSelectedProduct({ ...product, cartItem });
        setQuantity(cartItem?.quantity || 1); // Ensure quantity is set correctly
        setShowModal(true);
    };
if (isLoading) {
    return (
      <LoadingIndicator/>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl font-bold text-primary mb-14">
        {language === "ar" ?"المفضلة": "Favorites"} 
      </h1>
      {wishList.length === 0 || isError ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaHeartBroken className="text-primary text-6xl mb-4" />
          <p className="text-gray-700 text-lg">{language === "ar" ? "لا توجد عناصر في قائمة المفضلة.":"There are no items in the favorites list."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData && Array.isArray(productsData) && productsData.map((productData, index) => {
            const product = productData?.data?.products;
            const cartItem = cart.find((item) => item?.id === product?.id); 
                    const productVisibility = visibilityState[product?.id] || { showQuantity: false,isVisible: false };

            if (!product) return null;

            return (
              <div key={index} className="group relative">
                    <Link
                      to={`/productDetails/${product.id}`}
                      className="bg-white group-hover:translate-y-[-0.5rem] group-hover:shadow-lg transform transition-transform duration-300 rounded-lg shadow-md flex flex-col"
                    >
                      <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                        <div className="group h-48 overflow-hidden">
                          <img
                            src={product?.photos?.[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-contain transform transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <button
                              className="z-20"
                              onClick={(e) => {
                                e.preventDefault();
                                handleProductClick(product);
                              }}
                            >
                              <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                            </button>
                            
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <h3 className="font-semibold text-sm mb-2 px-2 text-primary">
                          {product?.category[0]?.name}
                        </h3>
                        <div className="relative h-10 flex items-center"> 
                          <div className={`absolute  ${language === "ar"? "-right-[4.3rem]":"-left-[4.3rem]"} transition-all duration-300 ease-in-out ${
                            productVisibility.showQuantity 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 -translate-y-full pointer-events-none'
                          }`}>
                            {productVisibility.showQuantity && (
                              <div
                                ref={quantityRef}
                                className={`flex shadow-2xl border border-primary mx-2 bg-white rounded-full transform transition-all duration-300 ${
                                  productVisibility.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                                }`}
                                onMouseEnter={(e) => handleQuantityMouseEnter(e, product.id)}
                                onMouseLeave={(e) => handleQuantityMouseLeave(e, product.id)}

                                onClick={(e) => e.preventDefault()}
                              >
                                {cartItem?.quantity === 1 ? <button
                                  onClick={() => removeFromCart(product.id)}
                                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-l " :" border-r "}border-primary hover:bg-gray-300 rounded-full`}
                                >
                                  <MdDelete />
                                </button>
                                :
                                  <button
                                  onClick={(e) => handleQuantityChange(-1, e,product)}
                                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-l " :" border-r "}border-primary hover:bg-gray-300 rounded-full`}
                                >
                                  <HiMinus />
                                </button>
                                }
                                
              
                                <p className="px-3 text-[1rem] flex items-center">{cartItem?.quantity || 0}</p>
                                <button
                                  onClick={(e) => handleQuantityChange(1, e,product)}
                                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-r " :" border-l "} border-primary hover:bg-gray-300 rounded-full`}
                                >
                                  <HiOutlinePlusSmall />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className={`transition-all duration-300 ease-in-out ${
                            productVisibility.showQuantity 
                              ? 'opacity-0 translate-y-full pointer-events-none' 
                              : 'opacity-100 translate-y-0'
                          }`}>
                            <button
                              className="z-20 mx-3 relative"
                              onClick={(e) => handleCartClick(e, product)}
                            >
                              {!!cartItem === true ?<div><span className="absolute text-white text-sm bottom-[1rem] left-4 ">{cartItem?.quantity}</span>  <BiCart className="bg-primary h-[1.95rem] w-[1.95rem] text-white rounded-lg shadow-2xl  p-1" /></div>
                              :
                               <BiCartAdd className="border border-primary h-[1.8rem] w-[1.8rem] text-slate-600 rounded-lg shadow-2xl  p-1" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col flex-grow px-2 mb-2">
                        <h2 className="text-lg font-medium duration-300 line-clamp-1 pb-2 group-hover:text-primary">
                          {product.title.length > 20
                            ? `${product.title.split(" ").slice(0, 4).join(" ")} ...`
                            : product.title}
                        </h2>
                        <hr />
                      </div>
                     <div className="flex items-center flex-row-reverse justify-between px-5 pb-3">
                        <div className="flex">
                          {/* عرض السعر العادي مع خط عليه في حالة وجود السعر الخاص */}
                          {product.special_price ? (
                            <>
                              <p className="text-xl mx-1 line-through text-gray-500">
                                {product.price} {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}
                              </p>
                              <p className="text-xl mx-1 font-bold text-primary ">
                                {product.special_price} {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}
                              </p>
                            </>
                          ) : (
                            <p className="text-xl">{product.price} {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}</p>
                          )}
                        </div>
                        <p className="text-gray-700">
                          {product.reviews_count ? product.reviews_count : 0}
                          <FaStar className="text-orange-500 inline-block" />
                        </p>
                      </div>
                    </Link>
                  </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)} 
        product={selectedProduct} 
        handleAddToCart={handleAddToCart} 
        language={language}
        currency={currencyData?.currency_icon}
        currencyEN={currencyData?.currency_name}
        handleAddToWish={handleAddToWish}
         wishList={wishList}
         setQuantity={setQuantity}
         quantity={quantity}
      />
      )}
      
    </div>
  );
}
