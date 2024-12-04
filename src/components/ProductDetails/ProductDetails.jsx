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
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../Modal/Modal';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';


export default function ProductDetails() {
  const { getProdDetails, currencyData, userData, getReviews } = useContext(ContextData);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { language } = useLanguage();
  const { addToCart, handleAddToWish, wishList } = useCart();
  const { id } = useParams();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getProdDetails', id, language],
    queryFn: () => getProdDetails(id),
    enabled: !!id
  });
  const { data: reviews } = useQuery({
    queryKey: ['getReviews', id, language],
    queryFn: () => getReviews(id),
    enabled: !!id
  });
  const product = data?.data?.products;
  const related = data?.data?.related;
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product && product.photos.length > 0) {
      setSelectedImage(product.photos[0].url);
    }
  }, [product]);
  const averageRating = reviews?.data.reviews.length > 0
    ?
    reviews?.data.reviews
      .map((item) => Number(item.rating))
      .reduce((acc, item) => acc + item, 0) / reviews?.data.reviews.length : 0;

  // console.log(averageRating.toFixed(1));


  const handleAddToCart = (product) => {
    addToCart(product, quantity);
  };

  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };


  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const handleAddReview = async (reviewData) => {
    try {
      const response = await axios.post(`https://tarshulah.com/api/review/store/${id}`, reviewData);
      if (response.data.message.includes("successfully added")) {
        toast.success(language === "ar" ? "تم إرسال التقييم بنجاح" : "Review submitted successfully");
      }
    } catch (error) {
      toast.error(language === "ar" ? "حدث خطأ أثناء إرسال التقييم" : "Error submitting review");
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
          <div className="flex flex-col md:flex-row-reverse md:items-start gap-6 mb-44">
            <div className='w-full md:w-1/2 h-80'>
              <img
                className="w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                src={selectedImage}
                alt={product.title}
              />
              <div className={`flex rounded-md mt-2 border-2 border-primary w-fit ${language === "ar" ? "mr-auto" : "ml-auto"}`}>
                {product.photos.map((photo, index) => (
                  <img key={index}
                    className="w-[4.5rem] h-[4.5rem] object-cover cursor-pointer"
                    src={photo.url}
                    alt={product.title}
                    onClick={() => setSelectedImage(photo.url)}
                  />

                ))}
              </div>
            </div>

            <div className="p-4 text-right flex-1">
              <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary">
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
                    handleAddToWish(product, isInWishList, () => { });
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
                  className="px-4 bg-primary w-36 text-white font-bold py-2 rounded "
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
              <div className='flex justify-between items-center'>
                <h3 className="mb-4 font-semibold mt-2"> {language === 'ar' ? 'الفئة' : 'Category'}:</h3>
                <p className="text-slate-700">
                  {product?.category?.map((category) => (
                    <span key={category.id} className="text-slate-600">
                      {category.name}
                    </span>
                  ))}
                </p>
              </div>
              <div className='flex justify-between items-center'>
                <h3 className="mb-4 font-semibold mt-2">
                  {language === 'ar' ? 'التقييم' : 'Review'}:
                </h3>
                <div className='flex items-center gap-2'>
                  <ul className="rate flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const decimalPart = averageRating - Math.floor(averageRating);
                      if (star <= Math.floor(averageRating)) {
                        // نجوم ممتلئة
                        return (
                          <li key={star} className="text-orange-500 ">
                            <FaStar />
                          </li>
                        );
                      } else if (star === Math.ceil(averageRating) && decimalPart > 0) {
                        return (
                          <li
                            key={star}
                            className="relative"
                            style={{ width: "0.9rem", height: "0.9rem" }}
                          >
                            <FaStar className="text-slate-200  absolute inset-0" />
                            <FaStar
                              className="text-orange-500 absolute inset-0 overflow-hidden"
                              style={{ clipPath: `${language === "ar" ? `inset(0 0 0 ${100 - decimalPart * 100}%)` : `inset(0 ${100 - decimalPart * 100}% 0 0)`} ` }}
                            />
                          </li>
                        );
                      } else {
                        return (
                          <li key={star} className="text-slate-200">
                            <FaStar />
                          </li>
                        );
                      }
                    })}
                  </ul>
                  <p className='text-[0.9rem]'>({averageRating.toFixed(1)})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}

        </>
      ) : (
        <p>المنتج غير موجود.</p>
      )}
      <div className='flex justify-evenly gap-7 '>
        <div className='w-64 flex flex-col'>
          <button
            onClick={() => openModal('reviewForm')}
            className="px-4 py-2 rounded hover:bg-primary hover:text-white duration-200"
          >
            {language === 'ar' ? 'إضافة تقييم' : 'Add Review'}
          </button>
          <span className="inline-block w-full h-[1px]  bg-primary"></span>
        </div>
        <div className='w-64 flex flex-col'>
          <button
            onClick={() => openModal('reviewList')}
            className="px-4 py-2 rounded hover:bg-primary hover:text-white duration-200"
          >
            {language === 'ar' ? 'عرض التقييمات' : 'View Reviews'}
          </button>
          <span className="inline-block w-full h-[1px] bg-primary"></span>
        </div>
      </div>

      {activeModal === 'reviewForm' && (
        <div className="fixed inset-0  bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 w-full mx-5 max-w-md relative"
            onClick={(e) => e.stopPropagation()} >
            <ReviewForm
              onSubmit={handleAddReview}
              userData={userData}
              language={language}
            />
            <button
              onClick={closeModal}
              className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'}  text-xl font-bold text-gray-600 hover:text-gray-800`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {activeModal === 'reviewList' && (
        <div className="fixed inset-0  bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 w-full mx-5 max-w-md relative"
            onClick={(e) => e.stopPropagation()} >
            <ReviewList reviews={reviews?.data.reviews} language={language} />
            <button
              onClick={closeModal}
              className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'}  text-xl font-bold text-gray-600 hover:text-gray-800`}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Related Products Section */}
      <div className="w-full mt-8">
        <h3 className=" text-2xl font-semibold mb-4"> {language === 'ar' ? 'منتجات ذات صلة' : 'Related Products'}</h3>
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
                            handleAddToWish(relatedProduct, isInWishList, () => { });
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
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          product={selectedProduct}
          handleAddToCart={handleAddToCart}
          language={language}
          currency={currencyData}
          handleAddToWish={handleAddToWish}
          wishList={wishList}
          setQuantity={setQuantity}
          quantity={quantity}
        />
      )}
    </div>
  );
}
