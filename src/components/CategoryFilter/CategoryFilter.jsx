import { useParams } from "react-router-dom";
import { ContextData } from "../../context/ContextApis";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContextPro";
import Modal from "../Modal/Modal";
import ProductCard from "../CartProduct/CardProduct";

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
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-3 my-5">
        {brandProduct ? 
         brandProduct.map((prods)=>(
             <ProductCard
            key={prods.id}
            product={prods}
            handleAddToCart={handleAddToCart}
            handleProductClick={handleProductClick}
            handleAddToWish={handleAddToWish}
            wishList={wishList}
            currencyData={currencyData}
          />
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
