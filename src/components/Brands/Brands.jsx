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

  useEffect(() => {
    if (data?.data?.brands) {
      setBrands(data.data.brands); // عرض جميع البيانات بدون تصفية
    }
  }, [data]);

  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

  const slidesToShow = Math.min(brands.length, 5); 

  const settings = {
    dots: false,
    infinite: true,
    speed: 4000,
    slidesToShow: slidesToShow, // استخدام عدد الشرائح المحسوب
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    draggable: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(brands.length - 1, 4), 
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(brands.length - 1, 3), 
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(brands.length - 1, 2), 
        },
      },
    ],
    afterChange: (currentSlide) => {
      sliderRef.current.slickGoTo(currentSlide);
    },
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
                  src={brand.photo || defaultImage} // إذا كانت الصورة غير موجودة، استخدم الصورة الافتراضية
                  alt={brand.slug}
                />
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}
