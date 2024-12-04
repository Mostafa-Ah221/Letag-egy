import { useState, useContext } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import { IoEyeSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CiHeart } from 'react-icons/ci';
import { useCart } from '../../context/CartContext';
import { IoIosHeart } from 'react-icons/io';
import { useLanguage } from '../../context/LanguageContextPro';
import Modal from '../Modal/Modal';

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
      <h2 className='text-right text-2xl font-semibold my-7'>{trendingSection?.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingSection ? (
          trendingSection?.childreen.map((item, index) => (
            <Link to={`/productDetails/${item.id}`} key={index} className="product-item flex flex-col h-full">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                  {item.photo && (
                    <div className="group h-48 overflow-hidden">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                     <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={(e) => { e.preventDefault(); handleProductClick(item); }} className="z-20">
                              <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                            </button>
                            <button
                            onClick={(e) => {
                              e.preventDefault();
                              const isInWishList = wishList.some(
                                (wishItem) => wishItem && wishItem.id === item.id
                              );
                              handleAddToWish(item, isInWishList, () => {});
                            }}
                            className="z-20"
                          >
                            {wishList.some(
                              (wishItem) => wishItem && wishItem.id === item.id
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
                    {item.title}
                  </h3>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-primary text-lg font-semibold">{item.price} {currencyData}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
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