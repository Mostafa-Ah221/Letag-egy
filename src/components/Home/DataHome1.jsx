import { useState, useContext, useEffect } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick';
import { IoEyeSharp } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { IoIosHeart } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContextPro';
import { useCart } from '../../context/CartContext';
import Modal from '../Modal/Modal';

const CustomArrow = ({ direction, onClick }) => (
  <button onClick={onClick} className={`absolute top-1/2 -translate-y-1/2 z-10
    ${direction === 'next' ? '-right-6' : '-left-6'}
    bg-white w-10 h-10 hover:bg-primary rounded-full shadow-lg group
    flex items-center justify-center duration-300 transition-colors
    border border-gray-200`}>
    {direction === 'next' ? (
      <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-white" />
    ) : (
      <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-white" />
    )}
  </button>
);

export default function DataHome({ sectionName }) {
  const { getApiHome, currencyData } = useContext(ContextData);
  const { language } = useLanguage();
  const { addToCart, handleAddToWish,wishList  } = useCart();


  const { data: homeData, isLoading, isError } = useQuery({
    queryKey: ['getApiHome', language], 
    queryFn: () => getApiHome(language), 
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  const handleAddToCart = (product) => {
    addToCart(product, quantity); 
  };

  useEffect(() => {
   
  }, [language, homeData]);

  const { data: sliderData, isLoading: isSliderLoading } = useQuery({
    queryKey: ['getSliderImages'],
    queryFn: async () => {
      const response = await fetch("http://demo.leetag.com/api/sliders");
      return response.json();
    },
    staleTime: 1000 * 60 * 15,
    cacheTime: 1000 * 60 * 30,
  });
// JavaScript for Mobile Click (Toggle on Click)
const handleProductClickk = (item) => {
  if (window.innerWidth < 768) {
    setSelectedProduct(item);
    setShowModal(true);
  }
};

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); 

  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const sections = {
    trending: language === "ar" ? "المنتجات الرائجة" : "featured",
    bestSelling: language === "ar" ? "أفضل المنتجات مبيعًا" : "best_sell",
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (isError) return <p>Error occurred while fetching data.</p>;

  const trendingSection = homeData?.data?.sections?.find(section => section.name === sectionName);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="relative">
      <h2 className={`text-2xl font-semibold my-7 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {trendingSection?.name}
      </h2>      
      <div className="relative">
          <Slider {...settings}>
          {trendingSection ? (
            trendingSection?.childreen.map((item, index) => {
              // Check if the product is in the wishlist
             const isInWishList = wishList.some((wishItem) => wishItem && wishItem.id === item.id);

              return (
                <div key={index} className="product-item px-2">
                  <div className="relative overflow-hidden rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 h-full bg-white">
                    <div onClick={() => handleProductClickk(item)}  className=" relative group aspect-h-9">
                      {item?.photo && (
                        <div className="w-full h-44">
                          <div className="relative w-full h-full">
                            <Link to={`/productDetails?id=${item.id}`}>
                              <img
                                src={item.photo}
                                alt={item.name}
                                className="w-full h-full object-cover absolute inset-0"
                              />
                            </Link>
                            <div className="product-actions absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleProductClick(item);
                                }}
                                className="z-20"
                              >
                                <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddToWish(item, isInWishList, () => {});
                                }}
                                className="z-20"
                              >
                                {isInWishList ?<IoIosHeart className='text-primary text-[2.5rem]'/> : 
                                 <CiHeart className='text-primary text-5xl'/>}
                                
                              </button>
                                
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Link to={`/productDetails/${item.id}`}>
                      <div className="p-4 flex flex-col justify-between h-24">
                        <h3 className="text-lg font-medium truncate">{item.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-primary text-sm">{item.price} {currencyData}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>لم يتم العثور على المنتجات الرائجة.</p>
          )}
        </Slider>
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


      <div className="flex items-center justify-center my-4">
        {sliderData && sectionName === sections.trending? (
          <img src={homeData.data.sliders[1].photo} className="w-[100%] md:h-[25rem] h-full md:object-cover object-contain  rounded-lg shadow-2xl" alt="Slider Image" />
        ) : sectionName === sections.bestSelling ? (
          <img src={sliderData.data.sliders[0].photo} className="w-[95%] md:h-[25rem] h-full md:object-cover object-contain rounded-lg shadow-2xl" alt="Slider Image" />
        ) : null}
      </div>
    </div>
  );
}
