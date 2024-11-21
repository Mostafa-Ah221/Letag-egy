import { FaHeartBroken, FaStar } from "react-icons/fa"; 
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";

export default function WishList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
const { addToCart, handleAddToWish,wishList  } = useCart();
  const { language } = useLanguage(); 


   const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };
const handleAddToCart = (product) => {
    addToCart(product, quantity); 
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-2xl font-bold text-orange-500 mb-6">
        قائمة المفضلة
      </h1>
      {wishList.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaHeartBroken className="text-orange-500 text-6xl mb-4" />
          <p className="text-gray-700 text-lg">لا توجد عناصر في قائمة المفضلة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishList.map((item) => (
           <div key={item.id} className="">
            <Link to={`/productDetails/${item.id}`} className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col p-2">
              <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                {item.photo && (
                  <div className="group h-48 overflow-hidden">
                    <img
                      src={item?.photo}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="z-20">
                        <IoEyeSharp onClick={(e) => { e.preventDefault(); handleProductClick(item); }} className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                      </button>
                      <button className="z-20">
                        <button
                    onClick={(e) => {
                      e.preventDefault();
                      const isInWishList = wishList.some(
                        (wishItem) => wishItem && wishItem.id === item.id
                      );
                      handleAddToWish(item, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {wishList.some(
                      (wishItem) => wishItem && wishItem.id === item.id
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
              <h3 className='text-right text-sm mt-3 text-slate-800'>{item?.category[0]?.name}</h3>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-right text-lg font-medium mb-2 duration-300 line-clamp-1 min-h-[3.5rem] group-hover:text-primary">
                  {item.title.length > 20 ? `...${item.title.split(" ").slice(0, 4).join(" ")}` : item.title}
                </h2>
              </div>
              <div className='flex items-center flex-row-reverse justify-between'>
                <p className='text-xl'>{language === 'ar' ? `دينار ${item.price}` : `$${item.price}`}</p>
                <p className='text-gray-700'>
                  {item.reviews_count ? item.reviews_count : 0}
                  <FaStar className='text-yellow-500 inline-block'/>
                </p>
              </div>
            </Link>
          </div>
          ))}
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
      )}
    </div>
  );
}
