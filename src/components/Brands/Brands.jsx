import { useContext, useRef, useState, useEffect } from "react";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContextPro";

export default function Brands() {
  const { getBrands } = useContext(ContextData);
  const { language } = useLanguage();
  const sliderRef = useRef(null);
  const [brands, setBrands] = useState([]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getBrands", language],
    queryFn: () => getBrands(language),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });
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
  useEffect(() => {
    if (data?.data?.brands) {
      setBrands(data.data.brands); // عرض جميع البيانات بدون تصفية
    }
  }, [data]);

  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

  const slidesToShow = Math.min(brands.length, 8); 

  const settings = {
   dots: false,
    infinite: true,
    speed: 4000, 
    slidesToShow: slidesToShow,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 2000, 
    cssEase: 'ease',  
    pauseOnHover: true,
    draggable: true,
  // swipe: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: Math.min(brands.length - 1, 6),
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: Math.min(brands.length - 1, 5),
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: Math.min(brands.length - 1, 3),
        slidesToScroll: 2,
      },
    },
  ],
};


  if (isLoading) return <div>جارٍ التحميل...</div>;
  if (isError) return <div>حدث خطأ أثناء جلب البيانات.</div>;

  return (
    <div className="relative px-6 py-4">
      <Slider ref={sliderRef} {...settings}>
        {brands.map((brand) => (
          <Link to={`/categoryFilter/${brand.id}`} key={brand.id} className="flex items-center justify-center px-2 cursor-pointer" state={{ title: brand.name }}>
            <div className="w-28 h-28 border border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-110 group">
              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  className="w-full h-full object-contain"
                  src={brand.photo || defaultImage} 
                  alt={brand.slug}
                />
              </div>
            </div>
          </Link>
        ))}
      </Slider>
       <PrevArrow />
        <NextArrow />
    </div>
  );
}
