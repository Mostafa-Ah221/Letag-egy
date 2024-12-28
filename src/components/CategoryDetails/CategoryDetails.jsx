import { useContext, useEffect, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from "react-paginate";
import { useLanguage } from '../../context/LanguageContextPro'; 
import { useCart } from '../../context/CartContext';
import Modal from '../Modal/Modal';
import ProductCard from '../CartProduct/CardProduct';
import LoadingIndicator from '../Loading/LoadingIndicator';

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
  const [progress, setProgress] = useState(0); 

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
    <LoadingIndicator/>
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
    <div className='px-2 my-5'>
      <h2 className=" my-7 font-semibold text-2xl">{data?.data?.category?.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
         {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
            handleProductClick={handleProductClick}
            handleAddToWish={handleAddToWish}
            wishList={wishList}
            currencyData={currencyData}
          />
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
