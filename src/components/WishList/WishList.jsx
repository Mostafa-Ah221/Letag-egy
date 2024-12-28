import { FaHeartBroken, FaStar } from "react-icons/fa"; 
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { useContext, useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import Modal from "../Modal/Modal";
import { GiBeachBag } from "react-icons/gi";
import LoadingIndicator from "../Loading/LoadingIndicator";

export default function WishList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, handleAddToWish, wishList } = useCart();
  const { language } = useLanguage(); 
  const { currencyData, getProdDetails } = useContext(ContextData);

  const ids = wishList.map((item) => item.id).filter(Boolean);

  const { data: productsData, isError, isLoading } = useQuery({
    queryKey: ["getProdDetails", ids, language],
    queryFn: () => Promise.all(ids.map((id) => getProdDetails(id, language))),
    enabled: ids.length > 0,
  });

  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product, quantity); 
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
            if (!product) return null;

            return (
              <div key={index} className="">
                <Link to={`/productDetails/${product?.id}`} className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-fit flex flex-col px-2">
                  <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                    {product?.photos?.[0]?.url && (
                      <div className="group h-48 overflow-hidden">
                        <img
                          src={product.photos[0].url}
                          alt=
                          {product.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            className="z-20"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                          >
                            <GiBeachBag className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                          </button>
                          <button className="z-20">
                            <IoEyeSharp 
                              onClick={(e) => { e.preventDefault(); handleProductClick(product); }} 
                              className="text-white bg-primary p-2 rounded-full text-[2.4rem]" 
                            />
                          </button>
                        </div>
                          
                      </div>
                    )}
                  </div>
                  <h3 className=" text-sm mt-3 text-slate-800">{product?.category?.[0]?.name}</h3>
                  <div className="p-4 flex flex-col ">
                    <h2 className=" text-lg font-medium  duration-300 line-clamp-1 group-hover:text-primary">
                      {product.title.length > 20 ? `${product.title.split(" ").slice(0, 4).join(" ")}...` : product.title}
                    </h2>
                  </div>
                  <div className="flex items-center flex-row-reverse justify-between py-4 px-2">
                    <p className="text-xl">{product.price} {currencyData}</p>
                    <p className="text-gray-700">
                      {product.reviews_count ? product.reviews_count : 0}
                      <FaStar className="text-orange-500 inline-block" />
                    </p>
                  </div>
                </Link>
                <button  onClick={(e) => {
                    e.preventDefault();
                    const isInWishList = wishList.some(
                      (wishItem) => wishItem && wishItem.id === product.id
                    );
                    handleAddToWish(product, isInWishList, () => {});
                  }} className="relative bottom-[104%] right-[94%] w-8 h-8 text-white bg-primary rounded-full">X</button>
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
        currency={currencyData}
        handleAddToWish={handleAddToWish}
         wishList={wishList}
         setQuantity={setQuantity}
         quantity={quantity}
      />
      )}
      
    </div>
  );
}
