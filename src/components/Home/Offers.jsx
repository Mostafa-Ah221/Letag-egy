import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { ContextData } from "../../context/ContextApis";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Offers() {
  const { getOffers } = useContext(ContextData);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const { data: offers } = useQuery({
    queryKey: ['getOffers'],
    queryFn: getOffers,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  const handleScroll = (direction) => {
    const container = document.getElementById('slider-container');
    const scrollAmount = direction === 'left' ? -420 : 420;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  return (
    <div className="relative overflow-hidden mb-3">
      {/* Left Arrow */}
      <button 
        onClick={() => handleScroll('left')}
        className="group absolute duration-200 left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-primary"
      >
        <ChevronLeft className="w-6 h-6 group-hover:text-white" />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={() => handleScroll('right')}
        className="group absolute duration-200 right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-primary"
      >
        <ChevronRight className="w-6 h-6 group-hover:text-white" />
      </button>

      {/* Slider Container */}
      <div 
        id="slider-container"
        className="flex gap-4 overflow-x-hidden scroll-smooth"
      >
        {offers?.data.offer_ads.map((offer) => (
          <div
            key={offer.id}
            className="w-1/3 flex-shrink-0 h-40"
          >
            <img
              src={offer.photo}
              alt="offers"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}