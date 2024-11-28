import { useContext,  useState } from 'react';
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
import axios from 'axios';
import toast from 'react-hot-toast';
import Zoom from 'react-medium-image-zoom';


export default function ProductDetails() {
  const { getProdDetails, currencyData, userData, token } = useContext(ContextData);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { language } = useLanguage();
  const { addToCart, handleAddToWish, wishList } = useCart();
  const { id } = useParams();

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['getProdDetails', id, language],
    queryFn: () => getProdDetails(id),
    enabled: !!id
  });

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };

  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const handleRating = (value) => {
    setRating(value);
  };


  const handleSubmitReview = async () => {
  if (!rating) {
    toast.error(language === 'ar' ? 'يرجى اختيار تقييم' : 'Please select a rating');
    return;
  }

  if (!comment.trim()) {
    toast.error(language === 'ar' ? 'يرجى كتابة تعليق' : 'Please write a comment');
    return;
  }

try {
  const reviewData = {
    product_id: id,
    rating: rating,
    comment: comment,
    name: userData?.name,
    email: userData?.email,
  };

  const response = await axios.post(`https://tarshulah.com/api/review/store/${id}`, reviewData);
  
  if (response.data.message?.includes('successfully added')) {
    toast.success(language === 'ar' ? 'تم إرسال التقييم بنجاح' : 'Review submitted successfully');
    setComment('');
    setRating(0);
    setShowReview(false);
    refetch();
  } else {
    throw new Error(response.data.message || 'Unexpected error');
  }
} catch (error) {
  console.error('Review submission error:', error);
  const errorMessage = error.response?.data?.message || 
    (language === 'ar' ? 'حدث خطأ أثناء إرسال التقييم' : 'Error submitting review');
  toast.error(errorMessage);
}

};


 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) return <div>Error loading product details</div>;

  const product = data?.data?.products;
  const related = data?.data?.related;

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
    <div className="flex flex-col items-center mt-5">
      {product ? (
        <>
          <div className="flex flex-col md:flex-row-reverse md:items-start gap-6">
            <div className='w-full md:w-1/2 h-80'>
           <img 
                className="w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-300" 
              src={product.photos[0].url} 
              alt={product.title} 
            />
              <div className={`flex rounded-md mt-2 border-2 border-primary w-fit ${language === "ar"? "mr-auto":"ml-auto"}`}>
              {product.photos.map((photo, index) => (
                  <img key={index} 
                  className="w-[4.5rem] h-[4.5rem] object-cover"
                  src={photo.url}
                  alt={product.title}
                />
                
              ))}
              </div>
            </div>

            <div className="p-4 text-right flex-1">
              <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-orange-500">
                  {product.price} {currencyData}
                </span>
                <span className="text-gray-400">
                 {language === 'ar' ? 'الكمية' : 'Quantity'}: {product.stock_qty}
                </span>
              </div>
              <div className="flex items-center justify-between mb-5 gap-2">
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
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 bg-primary w-36 text-white font-bold py-2 rounded hover:bg-orange-600"
                >
                  
                  {language === 'ar' ? 'أضف إلى العربة' : 'Add To Cart'}
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  min={1}
                  className="rounded-md border text-right text-primary border-stone-500 w-28 py-2 px-2"
                />
              </div>
              <hr />
              <div>
                <h3 className="mb-4 font-semibold mt-2">: {language === 'ar' ? 'الفئة' : 'Category'}</h3>
                <p className="text-slate-700">
                  {product?.category[0]?.name} - {product?.category[1]?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <button
            onClick={() => {
              
              setShowReview((prev) => !prev);
            }}
            className="bg-primary px-2 py-1 mt-20 text-white rounded-md hover:tracking-widest duration-300 text-xl "
          >
            {language === 'ar' ? 'تقييم' : 'Review'}
          </button>
          <span className="inline-block w-1/2 h-[1px] mt-3 bg-primary"></span>

          {showReview && (
            <div className="w-[70%] my-5">
              <div className="grid grid-cols-12 gap-3">
                <input
                  readOnly
                  type="text"
                  placeholder="Name"
                  value={userData?.name}
                  className="border w-full col-span-12 md:col-span-6 outline-none p-2 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.4)]"
                />
                <input
                  readOnly
                  type="email"
                  placeholder="E-mail"
                  value={userData?.email}
                  className="border w-full col-span-12 md:col-span-6 outline-none p-2 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.4)]"
                />
              </div>
              <textarea
                placeholder={language === 'ar' ? 'تعليق' : 'Comment'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border w-full my-3 outline-none p-2 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.4)]"
              ></textarea>
              <ul className="rate flex gap-2 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <li key={star}>
                    <FaStar
                      onClick={() => handleRating(star)}
                      className={`text-3xl cursor-pointer ${
                        star <= rating ? 'text-primary' : 'text-slate-300'
                      } hover:text-primary duration-200`}
                    />
                  </li>
                ))}
              </ul>
              {userData === null ? (
                <Link
                  to="/login"
                  className="bg-primary px-2 py-1 text-white mt-3 hover:bg-secondary"
                >
                  {language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please Login'}
                </Link>
              ) : (
                <button
                  onClick={handleSubmitReview}
                  disabled={!rating || !comment.trim()}
                  className={`bg-primary px-2 py-1 text-white mt-3 hover:bg-secondary ${
                    (!rating || !comment.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {language === 'ar' ? 'أرسل تقييمك' : 'Send Review'}
                </button>
              )}
            </div>
          )}

          {/* Display Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
  <div className="w-full mt-12 bg-white shadow-lg rounded-lg p-6">
    <h3 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      {language === 'ar' ? 'التقييمات' : 'Reviews'}
    </h3>
    <div className="space-y-6">
      {product.reviews.map((review, index) => (
        <div
          key={index}
          className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">
              {review.user?.name || (language === 'ar' ? 'مستخدم مجهول' : 'Anonymous User')}
            </span>
          </div>
          <p
            className={`text-gray-700 ${
              language === 'ar' ? 'text-right' : 'text-left'
            } leading-relaxed`}
          >
            {review.comment}
          </p>
          <div className="mt-4 text-right">
            <span className="text-sm text-gray-400">
              {new Date(review.created_at).toLocaleDateString(language === 'ar' ? 'ar' : 'en', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        </>
      ) : (
        <p>المنتج غير موجود.</p>
      )}

      {/* Related Products Section */}
      <div className="w-full mt-8">
        <h3 className="text-right text-2xl font-semibold mb-4">منتجات ذات صلة</h3>
        <Slider {...settings}>
          {related?.map((relatedProduct) => (
            <div key={relatedProduct.id} className="px-2">
              <Link
                to={`/productDetails/${relatedProduct.id}`}
                className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col p-2"
              >
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
                          <IoEyeSharp
                            className="text-white bg-primary p-2 rounded-full text-[2.4rem]"
                            onClick={(e) => {
                              e.preventDefault();
                              handleProductClick(relatedProduct);
                            }}
                          />
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
                <h3 className="text-right text-sm mt-3 text-slate-800">
                  {relatedProduct?.category[0]?.name}
                </h3>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-right text-lg font-medium mb-2 duration-300 line-clamp-1 min-h-[3.5rem] group-hover:text-primary">
                    ...{relatedProduct.title.split(" ").slice(0, 4).join(" ")}
                  </h2>
                </div>
                <div className="flex items-center flex-row-reverse justify-between">
                  <p className="text-xl font-semibold">
                    {relatedProduct.price} {currencyData}
                  </p>
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

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg relative max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <div className="mt-2 flex flex-row-reverse">
              <img
                src={selectedProduct.photo}
                
               alt={selectedProduct.title} className="w-4/5 h-64 object-cover rounded-md mt-4" />
              <div className=" mt-6">
                <h3 className="text-xl font-semibold">{selectedProduct.title}</h3>
                <span className="text-primary text-xl font-bold mb-5 block">{selectedProduct.price} {currencyData}</span>
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
                  {language === "ar" ? "إضافة إلى السلة":"Add To Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
