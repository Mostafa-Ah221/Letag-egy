import { useContext, useEffect, useState } from "react";
import { faCartShopping, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ContextData } from "../../context/ContextApis";
import { useLanguage } from "../../context/LanguageContextPro";
import { useQuery } from "@tanstack/react-query";

export default function ShoppingCart() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { currencyData, getProdDetails } = useContext(ContextData);
  const [disableTransition, setDisableTransition] = useState(false);
  const { language } = useLanguage();

  const ids = cart.map((item) => item.id);

  const { data: productsData, isError, isLoading } = useQuery({
    queryKey: ["getProdDetails", ids, language],
    queryFn: () => Promise.all(ids.map((id) => getProdDetails(id, language))),
    enabled: ids.length > 0,
  });

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    setDisableTransition(true);
    const timeout = setTimeout(() => {
      setDisableTransition(false);
    }, 50);

    return () => clearTimeout(timeout);
  }, [language]);

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

      <div
        className={`fixed top-0 ${language === "ar" ? "left-0" : "right-0"} h-full bg-white shadow-2xl transform ${
          isCartOpen ? "translate-x-0" : `${language === "ar" ? "-translate-x-full" : "translate-x-full"}`
        } ${disableTransition ? "transition-none" : "transition-transform duration-300 ease-in-out"} z-50`}
        style={{ width: "40vw" }}
      >
        <div className="p-6 relative h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-3xl font-semibold">{language === "ar" ? " السلة" : " Cart"}</h2>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={toggleCart}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {cart.length > 0 && productsData ? (
            <div className="space-y-4 h-72 overflow-auto">
              {productsData.map((productData, index) => {
                const product = productData.data.products;
                const cartItem = cart.find((item) => item.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="flex gap-4 items-center border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={product.photos[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex flex-col flex-grow overflow-hidden">
                      <h3 className="text-lg font-medium truncate">{product.title}</h3>
                      <span className="text-primary text-lg font-semibold">
                        {product.price} {currencyData}
                      </span>
                      <div className="flex items-center mt-2 gap-2 ">
                        <div className="flex border">
                        <button
                          onClick={() => updateQuantity(product.id, Math.max(cartItem.quantity - 1, 1))}
                          className="bg-gray-200 px-2  text-lg font-bold  hover:bg-gray-300"
                        >
                          -
                        </button>
                        <p className=" px-6 text-[1rem]  ">
                          {cartItem.quantity}
                        </p>
                        <button
                          onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                          className="bg-gray-200 px-2 text-lg font-bold  hover:bg-gray-300"
                        >
                          +
                        </button>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-600 text-sm font-medium ml-4"
                          onClick={() => removeFromCart(product.id)}
                        >
                          {language === "ar" ? "حذف" : " Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-600 text-lg mb-4">
                {language === "ar"
                  ? "عربتك فارغة. يبدو أنك لم تقم بإضافة أي منتج بعد."
                  : "  Your cart is empty. It seems you haven't added any products yet"}
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
              <h3>{language === "ar" ? " الاجمالي الفرعي" : "Subtotal"}:</h3>
              <span>
                {getTotalPrice().toFixed(2)} {currencyData}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <h3>{language === "ar" ? " الاجمالي " : "Total"}:</h3>
              <span>
                {getTotalPrice().toFixed(2)} {currencyData}
              </span>
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
                {language === "ar" ? " إلى السلة" : " To Cart"}
              </Link>
              <Link
                to={"/CartLayout"}
                onClick={() => {
                  toggleCart();
                }}
                className="block text-center mt-6 py-2 text-white bg-primary rounded-md shadow hover:bg-primary/90 transition-colors"
              >
                {language === "ar" ? " متابعة الدفع" : " Payment Tracking"}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
