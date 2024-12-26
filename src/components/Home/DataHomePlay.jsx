import { useState, useContext } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContextPro';
import Modal from '../Modal/Modal';
import ProductCard from '../CartProduct/CardProduct';

export default function DataHomePlay() {
    const [quantity, setQuantity] = useState(1); 
      const { addToCart, handleAddToWish,wishList  } = useCart(); 
  const { getApiHome,currencyData } = useContext(ContextData);
   const { language } = useLanguage();
  
    const { data: homeData, isLoading, isError } = useQuery({
    queryKey: ['getApiHome', language], 
    queryFn: () => getApiHome(language), 
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  const trendingSection = homeData?.data?.sections.find(section => section.name === "new" || section.name ==="منتجات وصلت حديثا");
  const [showModal, setShowModal] = useState(false);
  const [
    selectedProduct, setSelectedProduct] = useState(null);


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error occurred while fetching data.</p>;
const handleAddToCart = (product) => {
    addToCart(product, quantity); 
  };
  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 my-11">
      <h2 className=' text-2xl font-semibold my-7'>{trendingSection?.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingSection ? (
          trendingSection?.childreen.map((product, index) => (
           <ProductCard
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
            handleProductClick={handleProductClick}
            handleAddToWish={handleAddToWish}
            wishList={wishList}
            currencyData={currencyData}
          />
          ))
        ) : (
          <p className="text-center col-span-full">لم يتم العثور على المنتجات.</p>
        )}
      </div>

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