import { useContext } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import { IoEyeSharp } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

export default function DataHomePlay() {
  const { getApiHome } = useContext(ContextData);

  const { data: homeData, isLoading, isError } = useQuery({
    queryKey: ['getApiHome'],
    queryFn: getApiHome,
  });
  
  const trendingSection = homeData?.data?.sections.find(section => section.name === "منتجات وصلت حديثا");

  return (
    <div className="container mx-auto px-4 my-11">
      <h2 className='text-right text-2xl font-semibold my-7'>{trendingSection?.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingSection ? (
          trendingSection?.childreen.map((item, index) => (
            <Link to={`/productDetails?id=${item.id}`} key={index} className="product-item flex flex-col h-full">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                  {item.photo && (
                    <div className="group h-48 overflow-hidden">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-right text-lg font-medium mb-2 line-clamp-2 min-h-[3.5rem]">
                    {item.title}
                  </h3>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-primary text-lg font-semibold">{item.price} ريال</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-full">لم يتم العثور على المنتجات.</p>
        )}
      </div>
    </div>
  );
}