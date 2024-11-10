import { useContext } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick';
import { IoEyeSharp } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

const CustomArrow = ({ direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${direction === 'next' ? '-right-6' : '-left-6'}
        bg-white w-10 h-10 hover:bg-primary rounded-full shadow-lg group
        flex items-center justify-center duration-300 transition-colors
        border border-gray-200
      `}
    >
      {direction === 'next' ? (
        <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-white" />
      ) : (
        <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-white" />
      )}
    </button>
  );
};

export default function DataHome({ sectionName }) {
  const { getApiHome } = useContext(ContextData);

  const { data: homeData, isLoading, isError } = useQuery({
    queryKey: ['getApiHome'],
    queryFn: getApiHome,
  });

  const { data: sliderData, isLoading: isSliderLoading } = useQuery({
    queryKey: ['getSliderImages'],
    queryFn: async () => {
      const response = await fetch("http://demo.leetag.com/api/sliders");
      return response.json();
    },
  });

  if (isLoading || isSliderLoading) return <p>Loading...</p>;
  if (isError) return <p>Error occurred while fetching data.</p>;

  const trendingSection = homeData?.data?.sections.find(section => section.name === sectionName);

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
    <div className="px-6 relative">
      <h2 className='text-right text-2xl my-7'>{trendingSection?.name}</h2>
      <div className="relative">
        <Slider {...settings}>
          {trendingSection ? (
            trendingSection?.childreen.map((item, index) => (
              <Link to={`/productDetails?id=${item.id}`} key={index} className="product-item cursor-pointer px-2">
                <div className="relative overflow-hidden rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 h-full bg-white">
                  <div className="relative group aspect-w-16 aspect-h-9">
                    {item.photo && (
                      <div className="w-full h-48">
                        <div className="relative w-full h-full">
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover absolute inset-0"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between h-24">
                    <h3 className="text-right text-lg font-medium truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary text-sm">{item.price} ريال</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>لم يتم العثور على المنتجات الرائجة.</p>
          )}
        </Slider>
      </div>

      <div className="flex items-center justify-center my-4">
        {sliderData && sectionName === "أفضل المنتجات مبيعًا" ? (
          <img src={sliderData.data.sliders[0].photo} className='w-[95%] h-[25rem] object-cover rounded-lg shadow-2xl' alt="Slider Image" />
        ) : sectionName === "المنتجات الرائجة" ? (
          <img src={homeData.data.sliders[1].photo} className='w-[95%] h-[25rem] object-cover rounded-lg shadow-2xl' alt="Slider Image" />
        ) : null}
      </div>
    </div>
  );
}