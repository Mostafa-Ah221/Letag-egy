import { useContext, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IoEyeSharp } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { FaStar } from "react-icons/fa";
import { CiHeart } from 'react-icons/ci';
import { useLanguage } from '../../context/LanguageContextPro'; 
import { IoIosHeart } from 'react-icons/io';
import { useCart } from '../../context/CartContext';
import Modal from '../Modal/Modal';

export default function CategoryDetails() {
  const { getProductCategory,currencyData } = useContext(ContextData);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, handleAddToWish,wishList  } = useCart();
   const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  let { id } = useParams();
  const [page, setPage] = useState(0);
  const pageSize = 30;

  const { language } = useLanguage(); 

  const { data, isError, isLoading } = useQuery({
    queryKey: ['categoryDetails', id, language], 
    queryFn: () => getProductCategory(id),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

    const handleAddToCart = (product) => {
    addToCart(product, quantity); 
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        {language === 'ar' ? 'حدث خطأ أثناء تحميل التفاصيل. حاول مرة أخرى لاحقًا.' : 'An error occurred while loading the category details. Please try again later.'}
      </div>
    );
  }

  const allProducts = data?.data?.products || [];
  const totalPages = Math.ceil(allProducts.length / pageSize);
  
  const displayedProducts = allProducts.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      <h2 className="text-right my-7 font-semibold text-2xl">{data?.data?.category?.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {displayedProducts.map((subCategory) => (
          <div key={subCategory.id} className="">
            <Link to={`/productDetails/${subCategory.id}`} className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col p-2">
              <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                {subCategory.photo && (
                  <div className="group h-48 overflow-hidden">
                    <img
                      src={subCategory?.photo}
                      alt={subCategory.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="z-20">
                        <IoEyeSharp onClick={(e) => { e.preventDefault(); handleProductClick(subCategory); }} className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                      </button>
                      <button className="z-20">
                        <button
                    onClick={(e) => {
                      e.preventDefault();
                      const isInWishList = wishList.some(
                        (wishItem) => wishItem && wishItem.id === subCategory.id
                      );
                      handleAddToWish(subCategory, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {wishList.some(
                      (wishItem) => wishItem && wishItem.id === subCategory.id
                    ) ? (
                      <IoIosHeart className="text-primary text-[2.5rem]" />
                    ) : (
                      <CiHeart className="text-primary text-5xl" />
                    )}
                  </button>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <h3 className='text-right text-sm mt-3 text-slate-800'>{subCategory?.category[0]?.name}</h3>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-right text-lg font-medium mb-2 duration-300 line-clamp-1 min-h-[3.5rem] group-hover:text-primary">
                  {subCategory.title.length > 20 ? `...${subCategory.title.split(" ").slice(0, 4).join(" ")}` : subCategory.title}
                </h2>
              </div>
              <div className='flex items-center flex-row-reverse justify-between'>
                <p className='text-xl'>{subCategory.price}{currencyData}</p>
                <p className='text-gray-700'>
                  {subCategory.reviews_count ? subCategory.reviews_count : 0}
                  <FaStar className='text-yellow-500 inline-block'/>
                </p>
              </div>
            </Link>
          </div>
        ))}
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

      {/* أرقام الصفحات */}
      <div className="flex justify-center mt-6">
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={(selectedItem) => setPage(selectedItem.selected)}
          containerClassName="flex gap-2"
          activeClassName=" text-white bg-primary"
          pageClassName="px-3 py-2 bg-gray-200 rounded"
          previousClassName="hidden"
          nextClassName="hidden"
        />
      </div>
    </div>
  );
}
