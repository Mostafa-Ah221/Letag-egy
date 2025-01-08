import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { GiBeachBag } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContextPro";
import { HiOutlinePlusSmall, HiMinus } from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { BiCart, BiCartAdd } from "react-icons/bi";

const CardForCompSlider = ({
  product,
  handleAddToCart,
  handleProductClick,
  handleAddToWish,
  wishList,
  currencyData,
  updateQuantity,
  cartItem,
  isInCart,
  deleteProduct
}) => {
 const [showQuantity, setShowQuantity] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const quantityRef = useRef(null);
  const isInWishList = wishList && wishList.some((wishItem) => wishItem && wishItem.id === product.id);
  const { language } = useLanguage();
  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
  const imageSrc = product?.photo || defaultImage;

  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShowQuantity(false);
      }, 300); // Wait for fade out animation to complete
    }, 3000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleCartClick = (e) => {
    e.preventDefault();
    handleAddToCart(product);
    setShowQuantity(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 50); // Small delay to ensure transition works
    startTimer();
  };

  const handleQuantityChange = (change, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = cartItem?.quantity + change;
    
    if (newQuantity >= 1) {
      updateQuantity(product.id, newQuantity);
    }
    clearTimer();
  };

  const handleQuantityMouseEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimer();
  };

  const handleQuantityMouseLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTimer();
  };

  return (
    <div key={product.id} className="group mx-3">
      <Link
        to={`/productDetails/${product.id}`}
        className=" bg-white group-hover:translate-y-[-0.5rem] group-hover:shadow-lg transform transition-transform duration-300 rounded-lg shadow-md h-full flex flex-col"
      >
        <div className=" relative overflow-hidden rounded-t-lg  ">
        
            <div className="group h-48 overflow-hidden">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-contain transform transition-transform duration-300 "
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
                <div className="z-20">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToWish(product, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {isInWishList ? (
                      <IoIosHeart className="text-primary text-[2.7rem] mt-2" />
                    ) : (
                      <CiHeart className="text-primary text-[3.1rem] mt-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          
        </div>
         <div className="flex justify-between items-center mt-2">
          
          <div className="relative h-10 flex items-center"> 
            <div className={`absolute -right-[4.3rem] transition-all duration-300 ease-in-out ${
              showQuantity 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-full pointer-events-none'
            }`}>
              {showQuantity && (
                <div
                  ref={quantityRef}
                  className={`flex shadow-2xl border border-primary mx-2 bg-white rounded-full transform transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  }`}
                  onMouseEnter={handleQuantityMouseEnter}
                  onMouseLeave={handleQuantityMouseLeave}
                  onClick={(e) => e.preventDefault()}
                >
                 {cartItem?.quantity === 1 ? <button
                  onClick={() => deleteProduct(product.id)}
                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-l " :" border-r "}border-primary hover:bg-gray-300 rounded-full`}
                >
                  <MdDelete />
                </button>
                :
                  <button
                  onClick={(e) => handleQuantityChange(-1, e)}
                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-r " :" border-l "}border-primary hover:bg-gray-300 rounded-full`}
                >
                  <HiMinus />
                </button>
                }
                  <p className="px-3 text-[1rem] flex items-center">{cartItem?.quantity || 0}</p>
                  <button
                    onClick={(e) => handleQuantityChange(1, e)}
                    className="bg-gray-200 p-2 text-lg font-bold border-l border-primary hover:bg-gray-300 rounded-full
                    "
                  >
                    <HiOutlinePlusSmall />
                  </button>
                </div>
              )}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${
              showQuantity 
                ? 'opacity-0 translate-y-full pointer-events-none' 
                : 'opacity-100 translate-y-0'
            }`}>
             <button
                className="z-20 mx-3 relative"
                onClick={handleCartClick}
              >
                {isInCart === true ?<div><span className="absolute text-white text-sm bottom-[1rem] left-4 ">{cartItem?.quantity}</span>  <BiCart className="bg-primary h-[1.95rem] w-[1.95rem] text-white rounded-lg shadow-2xl  p-1" /></div>
                :
                  <BiCartAdd className="border border-primary h-[1.8rem] w-[1.8rem] text-slate-600 rounded-lg shadow-2xl  p-1" />}
              </button>
            </div>
          </div>
          <h3 className="font-semibold text-sm  mb-2 px-2 text-primary">
            {product?.category[0]?.name}
          </h3>
        </div>
        <div className="flex flex-col flex-grow px-2 mb-2">
          <h2 className=" text-lg font-medium duration-300 line-clamp-1 pb-2 group-hover:text-primary">
            {product.title.length > 20
              ? `...${product.title.split(" ").slice(0, 4).join(" ")} `
              : product.title}
          </h2>
          <hr />
        </div>
      <div className="flex items-center flex-row-reverse justify-between px-5 pb-3">
        <p className="text-gray-700">
            {product.reviews_count ? product.reviews_count : 0}
            <FaStar className="text-orange-500 inline-block" />
          </p>
          <div className="flex ">
            {product.special_price ? (
              <>
                <p className=" mx-1 line-through text-gray-500 flex gap-1">
                  <span>{currencyData}</span> <span>{product.price}</span> 
                </p>
                <p className="text-xl mx-1 font-bold text-primary flex gap-1">
                 <span>{currencyData}</span> <span>{product.special_price}</span>
                </p>
              </>
            ) : (
              <p className="text-xl flex gap-1"><span>{currencyData}</span> <span>{product.price}</span> </p>
            )}
          </div>
          
        </div>

      </Link>
    </div>
  );
};

export default CardForCompSlider;
