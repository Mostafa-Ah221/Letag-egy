import { CiHeart } from "react-icons/ci";
import { IoIosHeart } from "react-icons/io";
import { useCart } from "../../context/CartContext";

export default function Modal({
  isOpen,
  onClose,
  product,
  handleAddToCart,
  handleAddToWish,
  wishList,
  language,
  currency,
  currencyEN,
  
}) {
  const {  cart  } = useCart();
  if (!isOpen || !product) return null;
  
  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
              const cartItem = cart.find((item) => item.id === product.id);                   
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose} 
    >
      <div
        className="bg-white p-6 rounded-lg relative max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        {/* محتوى المودال */}
        <div className="mt-2 flex gap-1 flex-col md:flex-row-reverse">
          {/* صورة المنتج */}
          <img
            src={product.photo || defaultImage}
            alt={product.title}
            className="md:w-4/5 md:h-64 w-3/5 h-36 m-auto object-contain rounded-md mt-4"
          />

          {/* تفاصيل المنتج */}
          <div className="mt-6 md:pr-4">
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <span className="text-primary text-xl font-bold mb-5 block">
              {product.price} {language === "ar" ? currency:currencyEN} {/* عرض العملة */}
            </span>

            <div className="flex md:block gap-3">
              {/* زر الإضافة إلى السلة */}
              <div className="flex items-center justify-between mb-4">
                {/* زر الإضافة إلى المفضلة */}
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

                {/* كمية المنتج */}
                {/* <div className="flex border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 px-2  text-lg font-bold  hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-6 text-[1rem] ">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 px-2 text-lg font-bold  hover:bg-gray-300"
                  >
                    +
                  </button>
                </div> */}
                
                
              </div>
                  {!!cartItem === true ? <span  className="text-sm text-primary">{language === "ar" ? "هذا المنتج مضاف الي السله":"This product is added to the cart."}</span>:<button
                onClick={() => handleAddToCart(product)}
                className=" w-full  py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {language === "ar" ? "إضافة إلى السلة" : "Add To Cart"}
              </button>}
              {/* <div>
                {!!cartItem === true ? <span  className="text-sm text-primary">{language === "ar" ? "هذا المنتج مضاف الي السله":"This product is added to the cart."}</span>:""}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
