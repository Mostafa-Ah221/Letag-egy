import { useState, useContext, useEffect } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from '../../context/LanguageContextPro';
import { useCart } from '../../context/CartContext';
import Modal from '../Modal/Modal';
import CardForCompSlider from '../CartProduct/CardForCompSlider';
import LoadingIndicator from '../Loading/LoadingIndicator';

const CustomArrow = ({ direction, onClick }) => (
  <button onClick={onClick} className={`absolute top-1/2 -translate-y-1/2 z-10
    ${direction === 'next' ? 'right-0' : 'left-0'}
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
  const { addToCart, handleAddToWish, wishList } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { data: homeData, isLoading, isError } = useQuery({
    queryKey: ['getApiHome', language],
    queryFn: () => getApiHome(language),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };

  useEffect(() => {}, [language, homeData]);

  const { data: sliderData, isLoading: isSliderLoading } = useQuery({
    queryKey: ['getSliderImages'],
    queryFn: async () => {
      const response = await fetch("http://demo.leetag.com/api/sliders");
      return response.json();
    },
    staleTime: 1000 * 60 * 15,
    cacheTime: 1000 * 60 * 30,
  });

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
     <LoadingIndicator />
    );
  }
  if (isError) return <p>Error occurred while fetching data.</p>;

const trendingSection = homeData && homeData.data && homeData.data.sections
  ? homeData.data.sections.find(section => section.name === sectionName)
  : null;
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
      <h2 className={`text-2xl font-semibold my-7 `}>
        {trendingSection?.name}
      </h2>
      <div className="relative">
        <Slider {...settings}>
          {trendingSection ? (
            trendingSection?.childreen.map((item, index) => {
              return (
                <div key={index} className="product-item px-2">
                  <CardForCompSlider
                    product={item}
                    handleAddToCart={handleAddToCart}
                    handleProductClick={handleProductClick}
                    handleAddToWish={handleAddToWish}
                    wishList={wishList}
                    currencyData={currencyData}
                  />
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
        {sliderData && sectionName === sections.trending && homeData?.data?.sliders?.[1]?.photo ? (
          <img
            src={homeData.data.sliders[1]?.photo}
            className="w-[100%] md:h-[25rem] h-full md:object-cover object-contain rounded-lg shadow-lg"
            alt="Slider Image"
          />
        ) : sectionName === sections.bestSelling && sliderData?.data?.sliders?.[0]?.photo ? (
          <img
            src={sliderData.data.sliders[0]?.photo}
            className="w-[95%] md:h-[25rem] h-full md:object-cover object-contain rounded-lg shadow-lg"
            alt="Slider Image"
          />
        ) : null}
      </div>


    </div>
  );
}
