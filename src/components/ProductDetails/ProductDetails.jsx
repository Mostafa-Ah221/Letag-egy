import { useContext, useEffect, useRef, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CiHeart } from "react-icons/ci";
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
import CardForCompSlider from '../CartProduct/CardForCompSlider';
import LoadingIndicator from '../Loading/LoadingIndicator';
import { HiMinus, HiOutlinePlusSmall } from 'react-icons/hi2';
import { GiBeachBag } from 'react-icons/gi';
import { MdDelete } from 'react-icons/md';
import { BiCart, BiCartAdd } from 'react-icons/bi';


export default function ProductDetails() {
  const { getProdDetails, currencyData, userData, getReviews } = useContext(ContextData);
  const [quantity, setQuantity] = useState(1);
   const [showQuantity, setShowQuantity] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef(null);
    const quantityRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dataReview, setDataReview] = useState();
  const { language } = useLanguage();
  const { addToCart, handleAddToWish, wishList,cart, updateQuantity ,removeFromCart } = useCart();
  const { id } = useParams();
   const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['getProdDetails', id, language],
    queryFn: () => getProdDetails(id),
    enabled: !!id
  });
  const { data: reviews } = useQuery({
    queryKey: ['getReviews', id, language],
    queryFn: () => getReviews(id),
    enabled: !!id,
  });
                      const cartItem = cart.find((item) => item.id === data?.data?.products.id); 
                       const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShowQuantity(false);
      }, 300); // Wait for fade out animation to complete
    }, 3000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);
      const handleQuantityChange = (change, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = cartItem?.quantity + change;
    
    if (newQuantity >= 1) {
      updateQuantity(product.id, newQuantity);
    }
    clearTimer();
  };

  const handleQuantityMouseEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimer();
  };

  const handleQuantityMouseLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTimer();
  };                       
 useEffect(() => {
  if (reviews?.data?.reviews) {
    setDataReview(reviews?.data.reviews);
  }
}, [reviews]);

console.log(dataReview);
  const product = data?.data?.products;
  const related = data?.data?.related;
  const [selectedImage, setSelectedImage] = useState(null);
 const handleAddToCart = (product) => {
        addToCart(product, quantity); 
    };
  useEffect(() => {
    if (product && product.photos.length > 0) {
      setSelectedImage(product.photos[0].url);
    }
  }, [product]);
  const averageRating =  dataReview && dataReview.length > 0 ? dataReview
      .map((item) => Number(item.rating))
      .reduce((acc, item) => acc + item, 0) / dataReview.length : 0;

 const handleCartClick = (e) => {
    e.preventDefault();
    handleAddToCart(product);
    setShowQuantity(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 50); // Small delay to ensure transition works
    startTimer();
  };
  const handleProductClick = (product) => {
        const cartItem = cart.find((item) => item.id === product.id); 
        setSelectedProduct({ ...product, cartItem });
        setQuantity(cartItem?.quantity || 1); // Ensure quantity is set correctly
        setShowModal(true);
    };


  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const handleAddReview = async (reviewData) => {
    try {
      const response = await axios.post(`https://tarshulah.com/api/review/store/${id}`, reviewData);
      if (response.data.message.includes("successfully added")) {
        toast.success(language === "ar" ? "تم إرسال التقييم بنجاح" : "Review submitted successfully");
         queryClient.invalidateQueries(['getReviews', id, language]);
      }
    } catch (error) {
      toast.error(language === "ar" ? "حدث خطأ أثناء إرسال التقييم" : "Error submitting review");
    }
  };

  if (isLoading) {
    return (
      <LoadingIndicator/>
    );
  }

  if (isError) return <div>Error loading product details</div>;



  const CustomArrow = ({ direction, onClick }) => (
    <button onClick={onClick} className={`absolute top-1/2 -translate-y-1/2 z-10
      ${direction === 'next' ? '-right-1' : '-left-1'}
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
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };
    const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

  return (
    <div className="flex flex-col items-center mt-5 mb-11">
      {product ? (
        <>
          <div className="grid grid-cols-12 gap-6 mb-40">

           {/* Product Image Section */}
          <div className="col-span-12 md:col-span-4 w-full h-80 mb-28 md:mb-0">
            <img
              className="w-full h-full object-contain rounded-lg hover:scale-110 transition-transform duration-300"
              src={selectedImage || defaultImage}
              alt={product.title}
            />
            <div
              className={`flex rounded-md mt-4 gap-2 md:mx-0 ml-5 w-fit ${
                language === 'ar' ? 'mr-auto' : 'ml-auto'
              }`}
            >
              {product.photos.map((photo, index) => (
                <img
                  key={index}
                  className="w-[4.5rem] h-[4.5rem] border-2 border-primary rounded-md object-contain m-1 cursor-pointer"
                  src={photo.url}
                  alt={product.title}
                  onClick={() => setSelectedImage(photo.url)}
                />
              ))}
            </div>
          </div>

  {/* Product Details Section */}
          <div className="p-4 col-span-12 md:col-span-7">
            <h2 className="text-xl md:text-3xl font-bold mb-2">{product.title}</h2>
              <span className="text-2xl font-bold text-primary mb-4 inline-block">
                {product.price} {currencyData}
              </span>
            <div className="flex items-center justify-between  mb-5 gap-20">
               <span className="text-gray-400">
                {language === 'ar' ? 'الكمية' : 'Quantity'}: {product.stock_qty}
              </span>
              <div className='flex gap-20'>

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
             
               <div className="relative h-10 flex items-center"> 
                          <div className={`absolute  ${language === "ar"? "-right-[4.3rem]":"-left-[4.3rem]"} transition-all duration-300 ease-in-out ${
                            showQuantity 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 -translate-y-full pointer-events-none'
                          }`}>
                            {showQuantity && (
                              <div
                                ref={quantityRef}
                                className={`flex shadow-2xl border border-primary mx-2 bg-white rounded-full transform transition-all duration-300 ${
                                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                                }`}
                                onMouseEnter={handleQuantityMouseEnter}
                                onMouseLeave={handleQuantityMouseLeave}
                                onClick={(e) => e.preventDefault()}
                              >
                               {cartItem?.quantity === 1 ? <button
                                  onClick={() => removeFromCart(product.id)}
                                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-l " :" border-r "}border-primary hover:bg-gray-300 rounded-full`}
                                >
                                  <MdDelete />
                                </button>
                                :
                                  <button
                                  onClick={(e) => handleQuantityChange(-1, e)}
                                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-l " :" border-r "}border-primary hover:bg-gray-300 rounded-full`}
                                >
                                  <HiMinus />
                                </button>
                                }
                                <p className="px-3 text-[1rem] flex items-center">{cartItem?.quantity || 0}</p>
                                <button
                                  onClick={(e) => handleQuantityChange(1, e)}
                                  className={`bg-gray-200 p-2 text-lg font-bold ${language === "ar"?" border-r " :" border-l "} border-primary hover:bg-gray-300 rounded-full`}
                                >
                                  <HiOutlinePlusSmall />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className={`transition-all duration-300 ease-in-out ${
                            showQuantity 
                              ? 'opacity-0 translate-y-full pointer-events-none' 
                              : 'opacity-100 translate-y-0'
                          }`}>
                            <button
                              className="z-20 mx-3 relative"
                              onClick={handleCartClick}
                            >
                              {!!cartItem === true ?<div><span className="absolute text-white text-sm bottom-[1rem] left-4 ">{cartItem?.quantity}</span><BiCart className="bg-primary h-[1.95rem] w-[1.95rem] text-white rounded-lg shadow-2xl  p-1" /></div>
                              :
                                <BiCartAdd className="border border-primary h-[1.8rem] w-[1.8rem] text-slate-600 rounded-lg shadow-2xl  p-1" />}
                            </button>
                          </div>
                  </div>
              </div>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <h3 className="mb-4 font-semibold mt-2">
                {language === 'ar' ? 'الفئة' : 'Category'}:
              </h3>
              <p className="text-slate-700">
                {product?.category?.map((category) => (
                  <span key={category.id} className="text-slate-600">
                    {category.name}
                  </span>
                ))}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="mb-4 font-semibold mt-2">
                {language === 'ar' ? 'التقييم' : 'Review'}:
              </h3>
              <div className="flex items-center gap-2">
                <ul className="rate flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const decimalPart = averageRating - Math.floor(averageRating);
                    if (star <= Math.floor(averageRating)) {
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
                          style={{ width: '0.9rem', height: '0.9rem' }}
                        >
                          <FaStar className="text-slate-200 absolute inset-0" />
                          <FaStar
                            className="text-orange-500 absolute inset-0 overflow-hidden"
                            style={{
                              clipPath: `${
                                language === 'ar'
                                  ? `inset(0 0 0 ${100 - decimalPart * 100}%)`
                                  : `inset(0 ${100 - decimalPart * 100}% 0 0)`
                              }`,
                            }}
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
                <p className="text-[0.9rem]">({averageRating.toFixed(1)})</p>
              </div>
            </div>
            {/* Product Description */}
            {activeModal === 'Description' && (
              <div>
                <h3 className="mb-4 font-semibold mt-2">
                  {language === 'ar' ? 'وصف المنتج' : 'Product Description'}:
                </h3>
                <p>{language === 'ar' ? product.description.content_ar : product.description.content_en}</p>
              </div>
            )}
          </div>

        </div>

        

          {/* Review Section */}
       
       </>
      ) : (
        <p>المنتج غير موجود.</p>
      )}
      <div className=' flex md:flex-row justify-evenly gap-7 flex-col mb-7 '>
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
            onClick={() => openModal('Description')}
            className="px-4 py-2 rounded hover:bg-primary hover:text-white duration-200"
          >
            {language === 'ar' ? 'وصف المنتج ' : 'Product Description'}
          </button>
          <span className="inline-block w-full h-[1px] bg-primary"></span>
        </div>
      </div>
             
        {dataReview && dataReview.length > 0 ? (
          <>
            <h3 className="mb-4 font-semibold mt-2 text-lg">
              {language === 'ar' ? 'التقييمات' : 'Reviews'} 
              <span className="text-gray-500 ">({dataReview.length})</span>
            </h3>
            <div className="h-60 w-[70%] space-y-3 overflow-auto">
              {dataReview.map((review) => (
                <div 
                  key={review.id} 
                  className="p-4 flex flex-col sm:flex-row sm:justify-between gap-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <div className="">
                    <div className=''>
                      <h4 className="font-semibold text-gray-800">{review.name}</h4>
                      <p className="text-gray-600 ">{review.comment}</p>
                    </div>
                   <span className="text-sm  text-gray-500">
                      {review.created_at}
                    </span>
                  </div>
                    
                  
                  <ul className="rate flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <li
                        key={i}
                        className={i < review.rating ? "text-orange-500" : "text-gray-300"}
                      >
                        <FaStar />
                      </li>
                    ))}
                  </ul>
                  
                </div>
              ))}
            </div>
            
          </>
        ) : (
          <div className="text-center text-gray-500 mt-4 h-14 flex items-center justify-center">
            {language === "ar" ? "لا توجد تقييمات بعد" : "No reviews yet"}
          </div>
        )}

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

      {/* {activeModal === 'reviewList' && (
        <div className="fixed inset-0  bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 w-full mx-5 max-w-md relative"
            onClick={(e) => e.stopPropagation()} >
            <ReviewList reviews={dataReview} language={language} />
            <button
              onClick={closeModal}
              className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'}  text-xl font-bold text-gray-600 hover:text-gray-800`}
            >
              ✕
            </button>
          </div>
        </div>
      )} */}
      {/* Related Products Section */}
      <div className="w-full mt-8">
        <h3 className=" text-2xl font-semibold mb-4 px-4"> {language === 'ar' ? 'منتجات ذات صلة' : 'Related Products '}</h3>
        
        <Slider {...settings}>
          {related?.map((product) => {
             const cartItem = cart.find((item) => item.id === product.id);  
             return(   
            <div className="" key={product.id}>
             <CardForCompSlider
            product={product}
            handleAddToCart={handleAddToCart}
            handleProductClick={handleProductClick}
            handleAddToWish={handleAddToWish}
            wishList={wishList}
            updateQuantity={updateQuantity}
            currencyData={currencyData}
            cartItem={cartItem} 
            isInCart={!!cartItem}
            deleteProduct={removeFromCart}
          />
          
          </div>
             )
})}
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
