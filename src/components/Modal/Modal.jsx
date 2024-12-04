import { CiHeart } from "react-icons/ci";
import { IoIosHeart } from "react-icons/io";

export default function Modal({ isOpen, onClose, product,setQuantity,quantity, handleAddToCart,handleAddToWish,wishList, language,currency }) {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose} // إغلاق المودال عند النقر خارج المودال
    >
      <div
        className="bg-white p-6 rounded-lg relative max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()} // منع إغلاق المودال عند النقر داخله
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        {/* محتوى المودال */}
        <div className="mt-2 flex flex-col md:flex-row-reverse">
          {/* صورة المنتج */}
          <img
            src={product.photo}
            alt={product.title}
            className="md:w-4/5 md:h-64 w-3/5 h-36 m-auto object-cover rounded-md mt-4"
          />

          {/* تفاصيل المنتج */}
          <div className="mt-6 md:pr-4">
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <span className="text-primary text-xl font-bold mb-5 block">
              {product.price} {currency} {/* عرض العملة */}
            </span>

            <div className="flex md:block gap-3">
              {/* زر الإضافة إلى السلة */}
               <div className='flex items-center justify-between'>
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
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, e.target.value))} 
                      min={1} 
                      className='rounded-md text-right text-primary border border-stone-500 w-28 py-2 px-2'
                    />
                  </div>
              <button
                onClick={() => handleAddToCart(product)} 
                className="px-2 w-full md:mt-10 py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {language === "ar" ? "إضافة إلى السلة" : "Add To Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
