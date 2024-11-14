import { useContext, useEffect, useRef, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";


export default function SubCategory() {
  const { subCategories } = useContext(ContextData);
    const [filteredCategory, setFilteredCategory] = useState([]);

  const sliderRef = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subCategory'],
    queryFn: subCategories
  });

  useEffect(()=>{
    if(data?.data.categories){
        const availableCategor= data?.data.categories.filter(category => category.photo)
        setFilteredCategory(availableCategor)
    }
  },[data])
  // console.log(data);
  
  const NextArrow = () => (
    <div
      className="absolute top-1/2 -right-4 transform -translate-y-1/2 cursor-pointer z-10"
      onClick={() => sliderRef.current?.slickNext()}
    >
      <div className="bg-white shadow-[0_0_8px_2px_rgba(249,115,22,0.4)] rounded-full w-9 h-9 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 hover:text-white text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  const PrevArrow = () => (
    <div
      className="absolute top-1/2 -left-4 transform -translate-y-1/2 cursor-pointer z-10"
      onClick={() => sliderRef.current?.slickPrev()}
    >
      <div className="bg-white shadow-[0_0_8px_2px_rgba(249,115,22,0.4)] rounded-full w-9 h-9 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-primary">
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
    slidesToShow: 8,
    slidesToScroll: 2,
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
          slidesToShow: 6,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ]
  };

  // const handleCategoryClick = (index) => {
   
  // };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="relative  py-7">
        <h2 className='text-right pb-4 text-xl text-secondary'>الفئات الرئيسية</h2>
      <Slider ref={sliderRef} {...settings}>
        {filteredCategory.map((category, index) => (
          <div 
            key={index} 
            className='group px-2 cursor-pointer'
          >
            <Link to={`/categoryDetails/${category.id}`}>
             <div className='overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300'>
              <img 
                className='h-36 w-full object-cover transform transition-all duration-300 group-hover:scale-110' 
                src={category.photo} 
                alt={category.name} 
                loading="lazy"
              />
              <h3 className='text-center py-2 text-sm font-medium text-secondary group-hover:text-orange-500 transition-all duration-300'>
                {category.name.split(" ").slice(0,3).join(' ')}
              </h3>
            </div>
            </Link>
           
          </div>
        ))}
      </Slider>
      <PrevArrow />
      <NextArrow />
    </div>
  );
}