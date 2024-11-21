import { useContext, useState } from "react";
import { faCartShopping, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ContextData } from "../../context/ContextApis";

export default function ShoppingCart() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity,getTotalPrice } = useCart(); 
  const { currencyData } = useContext(ContextData);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="w-full relative">
      <div
        className="flex items-center justify-center w-full hover:cursor-pointer"
        onClick={toggleCart}
      >
        <div className="relative">
          <FontAwesomeIcon
            icon={faCartShopping}
            className="text-white text-[1.8rem] hover:scale-110 transition-transform duration-300"
          />
          <div className="bg-black flex justify-center items-center rounded-full text-center w-5 h-5 text-[0.8rem] text-white absolute bottom-5 -right-3 shadow-md">
            <span>{cart.length}</span>
          </div>
        </div>
      </div>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40"
          onClick={toggleCart}
        ></div>
      )}

      {/* النافذة الجانبية */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "50vw" }}
      >
        <div className="p-6 relative h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-2xl font-semibold">عربة التسوق</h2>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={toggleCart}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* عرض المنتجات في العربة */}
          {cart.length > 0 ? (
            <div className="space-y-4 h-72 overflow-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-lg font-medium truncate">{item.title}</h3>
                    <span className="text-primary text-lg font-semibold">
                      {item.price} دينار
                    </span>
                    <div className="flex items-center gap-4 mt-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Math.max(
                            1,
                            parseInt(e.target.value, 10) || 1
                          );
                          updateQuantity(item.id, newQuantity); 
                        }}
                        min={1}
                        className="w-16 text-center py-1 px-2 border border-gray-300 rounded-md shadow-sm"
                      />
                      <button
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                        onClick={() => removeFromCart(item.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-600 text-lg mb-4">
                عربتك فارغة. يبدو أنك لم تقم بإضافة أي منتج بعد.
              </p>
              <img
                src="https://img.freepik.com/free-vector/shopping-supermarket-cart-with-grocery-pictogram_1284-11697.jpg?ga=GA1.1.812912771.1724576833&semt=ais_hybrid"
                alt="Cart Empty"
                className="w-48 mx-auto"
              />
            </div>
          )}
           <div>
            <div className="flex justify-between items-center gap-2 my-5">
              <h3>الاجمالي الفرعي :</h3>
              <span>{getTotalPrice().toFixed(2)} {currencyData}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <h3>الاجمالي :</h3>
              <span>{getTotalPrice().toFixed(2)} {currencyData}</span>
            </div>
           </div>
          {cart.length > 0 && (
            <>
            <Link
              to={"/cartpage"}
              onClick={() => {
              toggleCart(); 
            }}
              className="block text-center mt-6 py-2 text-white bg-primary rounded-md shadow hover:bg-primary/90 transition-colors"
            >
               الي السلة
            </Link>
            <Link
              to={"/CartLayout"}
                onClick={() => {
              toggleCart(); 
            }}
              className="block text-center mt-6 py-2 text-white bg-primary rounded-md shadow hover:bg-primary/90 transition-colors"
            >
              متابعة الدفع
            </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
