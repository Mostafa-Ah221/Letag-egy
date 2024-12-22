import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ContextData } from "../../context/ContextApis";
import Slider from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
  >
    <ChevronRight className="w-6 h-6 text-gray-800" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
  >
    <ChevronLeft className="w-6 h-6 text-gray-800" />
  </button>
);

// إعدادات السلايدر
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  rtl: true, 
  responsive: [
    {
      breakpoint: 1024, 
      settings: {
        slidesToShow: 2, 
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640, 
      settings: {
        slidesToShow: 1, 
        slidesToScroll: 1,
      },
    },
  ],
};

export default function Offers() {
  const { getOffers } = useContext(ContextData);
  
  const { data: offers } = useQuery({
    queryKey: ['getOffers'],
    queryFn: getOffers,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  return (
    <div className="relative px-8 mb-3">
      <Slider {...sliderSettings}>
        {offers?.data.offer_ads.map((offer) => (
          <div key={offer.id} className="px-2"> 
            <img
              src={offer.photo}
              alt="offers"
              className="w-full h-40 object-cover object-center rounded-md"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}