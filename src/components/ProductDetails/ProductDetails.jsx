import { useContext, useEffect, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CiHeart } from "react-icons/ci";
import { IoEyeSharp } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa6';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import { useLanguage } from '../../context/LanguageContextPro';
import { useCart } from '../../context/CartContext';
import { IoIosHeart } from 'react-icons/io';

export default function ProductDetails() {
  const { getProdDetails } = useContext(ContextData);
  const [quantity, setQuantity] = useState(1);
    const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
    const { language } = useLanguage();
      const { addToCart, handleAddToWish,wishList  } = useCart();

 const handleAddToCart = (product) => {
    addToCart(product, quantity); 
  };
  const { id } = useParams(); 

 const { data, isError, isLoading } = useQuery({
  queryKey: ['getProdDetails', id,language], 
  queryFn: () => getProdDetails(id), 
  enabled: !!id
});

const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) return <div>Error loading product details</div>;

  const product = data?.data?.products;
  const related= data?.data?.related;
// console.log(related);

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
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="flex flex-col items-center p-6">
      {product ? (
        <div className="flex flex-col md:flex-row-reverse md:items-start gap-6">
          <img className="w-full md:w-1/2 h-80 object-cover rounded-lg" src={product.photos[0].url} alt={product.title} />

          <div className="p-4 text-right flex-1">
            <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-orange-500">ريال {product.price} </span>
              <span className="text-gray-400">الكمية المتاحة: {product.stock_qty}</span>
            </div>
            <div className='flex items-center justify-between mb-5 gap-2'>
              <button
                    onClick={(e) => {
                      e.preventDefault();
                      const isInWishList = wishList.some(
                        (wishItem) => wishItem && wishItem.id === product.id
                      );
                      handleAddToWish(product, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {wishList.some(
                      (wishItem) => wishItem && wishItem.id === product.id
                    ) ? (
                      <IoIosHeart className="text-primary text-[2.5rem]" />
                    ) : (
                      <CiHeart className="text-primary text-5xl" />
                    )}
                  </button>
              <button  onClick={() => handleAddToCart(product)}
               className="px-4 bg-primary w-36 text-white font-bold py-2 rounded hover:bg-orange-600">
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
              <h3 className="mb-4 font-semibold mt-2">:الفئة</h3>
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
          {related?.map((relatedProduct) => (
            <div key={relatedProduct.id} className="px-2">
              <Link to={`/productDetails/${relatedProduct.id}`} className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col p-2">
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
                          <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" onClick={(e) => { e.preventDefault(); handleProductClick(relatedProduct); }} />
                        </button>
                          <button
                    onClick={(e) => {
                      e.preventDefault();
                      const isInWishList = wishList.some(
                        (wishItem) => wishItem && wishItem.id === relatedProduct.id
                      );
                      handleAddToWish(relatedProduct, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {wishList.some(
                      (wishItem) => wishItem && wishItem.id === relatedProduct.id
                    ) ? (
                      <IoIosHeart className="text-primary text-[2.5rem]" />
                    ) : (
                      <CiHeart className="text-primary text-5xl" />
                    )}
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
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-lg relative max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800">
              ✕
            </button>
            <div className="mt-2 flex flex-row-reverse">
              <img src={selectedProduct.photo} alt={selectedProduct.title} className="w-4/5 h-64 object-cover rounded-md mt-4" />
              <div className=" mt-6">
                <h3 className="text-xl font-semibold">{selectedProduct.title}</h3>
                <span className="text-primary text-xl font-bold mb-5 block">{selectedProduct.price} ريال</span>
                <div className='flex items-center justify-between'>
                    <button
                    onClick={(e) => {
                      e.preventDefault();
                      const isInWishList = wishList.some(
                        (wishItem) => wishItem && wishItem.id === selectedProduct.id
                      );
                      handleAddToWish(selectedProduct, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {wishList.some(
                      (wishItem) => wishItem && wishItem.id === selectedProduct.id
                    ) ? (
                      <IoIosHeart className="text-primary text-[2.5rem]" />
                    ) : (
                      <CiHeart className="text-primary text-5xl" />
                    )}
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, e.target.value))} 
                    min={1} 
                    className='rounded-md text-right text-primary border border-stone-500 w-28 py-2 px-2'
                  />
                </div>
                <button onClick={() => handleAddToCart(selectedProduct)}
                 className="px-2 w-full mt-10 py-2 bg-primary text-white hover:bg-primary/90 transition-colors">
                  إضافة إلى السلة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
