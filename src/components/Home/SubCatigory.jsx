import { useContext, useEffect, useRef, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useLanguage } from '../../context/LanguageContextPro'; 
import Offers from './Offers';

export default function SubCategory() {
  const { subCategories } = useContext(ContextData);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const { language } = useLanguage();
  const sliderRef = useRef(null);

  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subCategory', language], 
    queryFn: () => subCategories(language),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  useEffect(() => {
    if (data?.data.categories) {
      setFilteredCategory(data.data.categories);
    }
  }, [data, language]); 

  const NextArrow = () => (
    <div
      className="absolute lg:top-[50%] top-[96%] right-2 transform -translate-y-1/2 cursor-pointer z-10"
      onClick={() => sliderRef.current?.slickNext()}
    >
      <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 hover:text-white text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  const PrevArrow = () => (
    <div
      className="absolute lg:top-[50%] top-[96%] left-2 transform -translate-y-1/2 cursor-pointer z-10"
      onClick={() => sliderRef.current?.slickPrev()}
    >
      <div className="bg-white  rounded-full w-9 h-9 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 hover:text-white text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500, 
    slidesToShow: Math.min(filteredCategory.length, 8),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, 
    cssEase: 'ease',  
    pauseOnHover: true,
    draggable: true,
    arrows: false, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(filteredCategory.length, 6),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(filteredCategory.length, 5),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(filteredCategory.length, 3),
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) return <div>Error loading categories</div>;

  return (
    <div>
      <div className="relative py-7 mb-7">
        <h2 className='pb-4 text-xl text-secondary px-2'>
          {language === "ar" ? "الفئات الرئيسية" : "Main Categories"}
        </h2>
        <Slider ref={sliderRef} {...settings}>
          {filteredCategory.map((category, index) => (
            <div key={index} className='group px-2 cursor-pointer'>
              <Link to={`/categoryDetails/${category.id}`}>
                <div className='overflow-hidden rounded-lg bg-Neutral shadow-sm hover:shadow-md transition-all duration-300'>
                  <img 
                    className='h-20 w-full object-contain transform transition-all duration-300 group-hover:scale-110' 
                    src={category.photo || defaultImage} 
                    alt={category.slug} 
                    loading="lazy"
                  />
                  <h3 className='text-center py-2 text-sm font-medium text-secondary group-hover:text-primary transition-all duration-300'>
                    {category.slug.split(" ").slice(0, 2).join(' ')}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
        <PrevArrow />
        <NextArrow />
      </div>
      <Offers />
    </div>
  );
}
