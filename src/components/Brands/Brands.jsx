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
  const [filteredBrands, setFilteredBrands] = useState([]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getBrands",language],
    queryFn:()=> getBrands(language),
  });

  useEffect(() => {
    if (data?.data?.brands) {
      const availableBrands = data.data.brands.filter(brand => brand.photo);
      setFilteredBrands(availableBrands);
    }
  }, [data]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 4000,
    slidesToShow: 9,
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
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
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
        {filteredBrands.map((brand) => (
          <Link to={`/categoryFilter/${brand.id}`} key={brand.id} className="flex items-center justify-center px-2 cursor-pointer" state={{ title: brand.name }}>
            <div className="w-28 h-28 border border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-110 group">
              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  className="w-full h-full object-contain"
                  src={brand.photo}
                  alt={brand.slug}
                  onError={(e) => { e.target.src = "/path/to/placeholder-image.jpg"; }}
                />
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}