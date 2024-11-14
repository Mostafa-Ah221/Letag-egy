import { useContext, useEffect, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CiHeart } from "react-icons/ci";
import { IoEyeSharp } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa6';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';

export default function ProductDetails() {
  const { getProdDetails, getProductCategory } = useContext(ContextData);
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getProdDetails', id],
    queryFn: () => getProdDetails(id),
  });

  // Fetch related products
  const categoryID = data?.data?.sections
    .find(sec => sec.childreen.some(prod => prod.id === parseInt(id)))
    ?.childreen.find(prod => prod.id === parseInt(id))
    ?.category?.[0]?.id;

  const { data: relatedProductsData } = useQuery({
    queryKey: ['getRelatedProducts', categoryID],
    queryFn: () => getProductCategory(categoryID),
    enabled: !!categoryID,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) return <div>Error loading product details</div>;

  const section = data?.data?.sections.find(sec => sec.childreen.some(prod => prod.id === parseInt(id)));
  const product = section?.childreen.find(prod => prod.id === parseInt(id));

  const CustomArrow = ({ direction, onClick }) => (
    <button onClick={onClick} className={`absolute top-1/2 -translate-y-1/2 z-10
      ${direction === 'next' ? '-right-6' : '-left-6'}
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="flex flex-col items-center p-6">
      {product ? (
        <div className="flex flex-row-reverse">
          <img className="w-full h-80 object-cover" src={product.photo} alt={product.title} />

          <div className="p-6 text-right">
            <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-orange-500">ريال {product.price} </span>
              <span className=" text-gray-400">الكمية المتاحة: {product.stock_qty}</span>
            </div>
            <div className='flex items-center justify-between mb-5 gap-2'>
              <CiHeart className='text-primary text-4xl' />
              <button className="px-4 bg-primary w-36 text-white font-bold py-2 rounded hover:bg-orange-600">
                أضف إلى العربة
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, e.target.value))} 
                min={1} 
                className='rounded-md border text-right text-primary border-stone-500 w-28 py-2 px-2'
              />
            </div>
            <hr />
            <div>
              <h3 className=" mb-4 font-semibold mt-2">:الفئة</h3>
              <p className='text-slate-700'>{product?.category[0]?.name} - {product?.category[1]?.name}</p>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between mt-4">
                <span>منتجات أصلية %100</span>
                <span>توصيل سريع</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>المنتج غير موجود.</p>
      )}

      {/* قسم المنتجات ذات الصلة */}
      <div className="w-full mt-8">
        <h3 className="text-right text-2xl font-semibold mb-4">منتجات ذات صلة</h3>
        <Slider {...settings}>
          {relatedProductsData?.data?.products?.map((relatedProduct) => (
            <div key={relatedProduct.id} className="px-2">
              <div className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col p-2">
                <div className="relative overflow-hidden rounded-t-lg">
                  {relatedProduct.photo && (
                    <div className="group h-48 overflow-hidden relative">
                      <img
                        src={relatedProduct.photo}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="z-20">
                          <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                        </button>
                        <button className="z-20">
                          <CiHeart className="text-primary p-2 rounded-full text-[3.8rem]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-right text-sm mt-3 text-slate-800">{relatedProduct?.category[0]?.name}</h3>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-right text-lg font-medium mb-2 duration-300 line-clamp-1 min-h-[3.5rem] group-hover:text-primary">
                    ...{relatedProduct.title.split(" ").slice(0, 4).join(" ")}
                  </h2>
                </div>
                <div className="flex items-center flex-row-reverse justify-between">
                  <p className="text-xl font-semibold">دينار {relatedProduct.price}</p>
                  <p className="text-gray-700">
                    ({relatedProduct.reviews_count || 0})
                    <FaStar className="text-yellow-500 inline-block ml-1" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
