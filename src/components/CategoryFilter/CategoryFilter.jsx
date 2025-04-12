import { useParams } from "react-router-dom";
import { ContextData } from "../../context/ContextApis";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContextPro";
import Modal from "../Modal/Modal";
import ProductCard from "../CartProduct/CardProduct";
import LoadingIndicator from "../Loading/LoadingIndicator";

export default function CategoryFilter() {
  const { fetchProducts,cityData,currencyData } = useContext(ContextData);
  const { addToCart, handleAddToWish,wishList,removeFromCart ,cart,updateQuantity } = useCart(); 
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); 
   const { language } = useLanguage();
  
  const { id } = useParams();
  const filters = {
    "brands_id[0]":id ,
  };

const { data, isLoading } = useQuery({
    queryKey: ["fetchProducts", filters,language,cityData],
    queryFn: () => fetchProducts(filters,cityData),
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
      <LoadingIndicator/>
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
         brandProduct.map((product)=>{
           const cartItem = cart.find((item) => item.id === product.id);     
          return(
             <ProductCard
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
            handleProductClick={handleProductClick}
            handleAddToWish={handleAddToWish}
           wishList={wishList}
            updateQuantity={updateQuantity}
            currencyData={currencyData?.currency_icon}
            currencyEN={currencyData?.currency_name}
            cartItem={cartItem} 
            isInCart={!!cartItem}
              deleteProduct={removeFromCart}

          />
          )
})
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
        currency={currencyData?.currency_icon}
          currencyEN={currencyData?.currency_name}
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
