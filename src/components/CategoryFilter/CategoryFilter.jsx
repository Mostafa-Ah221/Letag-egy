import { Link, useParams } from "react-router-dom";
import { ContextData } from "../../context/ContextApis";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoIosHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { IoEyeSharp } from "react-icons/io5";
import { useCart } from "../../context/CartContext";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContextPro";
import Modal from "../Modal/Modal";

export default function CategoryFilter() {
  const { fetchProducts } = useContext(ContextData);
  const { addToCart, handleAddToWish,wishList  } = useCart(); 
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const { currencyData } = useContext(ContextData);
   const { language } = useLanguage();
  
  const { id } = useParams();
  const filters = {
    "brands_id[0]":id ,
  };

const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchProducts", filters,language],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });
  const location = useLocation();
const title = location.state?.title

const handleAddToCart = (product) => {
    addToCart(product, quantity); 
  };
const brandProduct=data?.data?.products
 const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

 if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center justify-center py-7">
         <p className="text-gray-600 text-[1rem] ">{language === "ar" ? "علامة تجارية": "Brand"}/</p>
         <h1 className=" text-[1.7rem] font-bold text-primary ">{title} </h1>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {brandProduct ? 
         brandProduct.map((prods)=>(
            <Link to={`/productDetails/${prods.id}`} key={prods.id} className="product-item flex flex-col h-full">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                  {prods.photo && (
                    <div className="group h-48 overflow-hidden">
                      <img
                        src={prods.photo}
                        alt={prods.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                     <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={(e) => { e.preventDefault(); handleProductClick(prods); }} className="z-20">
                              <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                            </button>
                            <button
                            onClick={(e) => {
                              e.preventDefault();
                              const isInWishList = wishList.some(
                                (wishItem) => wishItem && wishItem.id === prods.id
                              );
                              handleAddToWish(prods, isInWishList, () => {});
                            }}
                            className="z-20"
                          >
                            {wishList.some(
                              (wishItem) => wishItem && wishItem.id === prods.id
                            ) ? (
                              <IoIosHeart className="text-primary text-[2.5rem]" />
                            ) : (
                              <CiHeart className="text-primary text-5xl" />
                            )}
                          </button>
                          </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-right text-lg font-medium mb-2 line-clamp-2 min-h-[3.5rem]">
                    {prods.title}
                  </h3>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-primary text-lg font-semibold">{prods.price} {currencyData}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
         ))
        :
        ""
        }

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
    </div>
   
  )
}
