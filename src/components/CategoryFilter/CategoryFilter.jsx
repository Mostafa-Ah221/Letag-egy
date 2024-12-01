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
         <h1 className=" text-[1.7rem] font-bold text-orange-500 ">{title} </h1>
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

         {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-lg relative max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800">
              ✕
            </button>
            <div className="mt-2 flex flex-col md:flex-row-reverse">
              <img src={selectedProduct.photo} alt={selectedProduct.title} className="md:w-4/5 md:h-64 w-3/5 h-36 m-auto object-cover rounded-md mt-4" />
              <div className=" mt-6">
                <h3 className="text-xl font-semibold">{selectedProduct.title}</h3>
                <span className="text-primary text-xl font-bold mb-5 block">{selectedProduct.price} {currencyData}
                </span>
                <div className='flex md:block gap-3'>
                <div className='flex items-center justify-between'>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const isInWishList = wishList.some(
                        (wishItem) => wishItem && wishItem.id === selectedProduct.id
                      );
                      handleAddToWish(selectedProduct, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {wishList.some(
                      (wishItem) => wishItem && wishItem.id === selectedProduct.id
                    ) ? (
                      <IoIosHeart className="text-primary text-[2.5rem]" />
                    ) : (
                      <CiHeart className="text-primary text-5xl" />
                    )}
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, e.target.value))} 
                    min={1} 
                    className='rounded-md text-right text-primary border border-stone-500 w-28 py-2 px-2'
                  />
                </div>
                <button onClick={() => handleAddToCart(selectedProduct)}  className="px-2 w-full md:mt-10 py-2 bg-primary text-white hover:bg-primary/90 transition-colors">
                  {language === "ar" ? "إضافة إلى السلة":"Add To Cart"}
                </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
   
  )
}
