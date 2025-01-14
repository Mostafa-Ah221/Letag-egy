import React, { useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import axios from "axios";
import { IoEyeSharp } from 'react-icons/io5';
import { IoIosHeart } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { useCart } from '../../context/CartContext';
import { useLocation } from 'react-router-dom';
import ProductCard from '../CartProduct/CardProduct';
import Modal from '../Modal/Modal';

function SearchByItem() {
  const { id } = useParams();
  const { subCategories, userData,currencyData,api_key } = useContext(ContextData);
  const [searchData, setSearchData] = useState(null);
  const [searchData2, setSearchData2] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { language } = useLanguage();
  const { selectedTownId } = useContext(ContextData);
  const { addToCart, handleAddToWish, wishList } = useCart();
      const [quantity, setQuantity] = useState(1); 
  const location = useLocation();

  const { data } = useQuery({
    queryKey: ["subCategory", language],
    queryFn: subCategories,
  });
const handleAddToCart = (product) => {
    addToCart(product, quantity); 
  };
  
  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setSearchData(null);
        setSearchData2(null);
        return;
      }

      // تصفية الفئات
      const filteredCategories = data?.data.categories.filter((item) =>
        item.name.toLowerCase().includes(id.toLowerCase())
      );
      setSearchData(filteredCategories?.length ? filteredCategories : null);

      // جلب المنتجات
      const formData = new FormData();
      formData.append("search", id);
      if (selectedTownId) {
        formData.append("city_id", selectedTownId);
      }

      try {
        const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
          headers: { lang: language ,APP_KEY:api_key},
        });
        const products = response.data?.data?.products || [];
        setSearchData2(products.length ? products : null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSearchData2(null);
      }
    };

    fetchData();
  }, [id, data, language, selectedTownId]);
  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

  return (
    <div className='px-3'>
      {searchData && <h1 className="mx-2 my-2 text-2xl font-semibold text-primary">{language === "ar" ? "الفئات" : "Categories"}</h1>}
      <p><span className='font-semibold mb-1'>{searchData?.length}</span> تم العثور على نتائج البحث</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchData?.map((category) => (
          <Link to={`/categoryDetails/${category.id}`} key={category.id} className='group'>
            <div className="  group-hover:translate-y-[-0.5rem]  transform transition-transform duration-300 rounded-lg  h-full flex flex-col">
              <div className="aspect-w-1 aspect-h-1 relative overflow-hidden ">
                {category.photo && (
                  <div className="group h-40 overflow-hidden bg-white">
                    <img
                      src={category.photo || defaultImage}
                      alt={category.name}
                      className="w-full h-full object-contain transform transition-transform duration-300 "
                    />
                  </div>
                )}
              </div>
              <div className=' py-3 group-hover:text-primary duration-200'>
              <p>{category.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <hr />

      {searchData2 && <h1 className="mx-2 my-2 text-2xl font-semibold text-primary">{language === "ar" ? "المنتجات" : "Products"}</h1>}
      <p className='text-sm mb-1'><span className='font-semibold'>{searchData2?.length}</span> تم العثور على نتائج البحث</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchData2?.map((product) => (
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

export default SearchByItem;
