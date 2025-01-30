import { useContext } from "react";
import { useCart } from "../../context/CartContext";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { Link } from "react-router-dom";
import LoadingIndicator from "../Loading/LoadingIndicator";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { currencyData, getProdDetails, settings_domain  } = useContext(ContextData);

  const { language } = useLanguage();
  // const [quantity, setQuantity] = useState(1);
  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

  const ids = cart.map((item) => item.id);

  const { data: productsData, isError, isLoading } = useQuery({
    queryKey: ["getProdDetails", ids, language],
    queryFn: () => Promise.all(ids.map((id) => getProdDetails(id, language))),
    enabled: ids.length > 0,
  });

  // Function to truncate title to 4 words
  const truncateTitle = (title) => {
    const words = title.split(' ');
    if (words.length > 4) {
      return words.slice(0, 4).join(' ') + '...';
    }
    return title;
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError)
    return (
      <div>
        {language === "ar"
          ? "حدث خطأ أثناء تحميل البيانات."
          : "An error occurred while loading the data."}
      </div>
    );

  return (
    <div className="w-full px-1 sm:px-5 my-3 sm:my-10">
      <h1 className="font-bold text-lg sm:text-3xl text-center mb-3 sm:mb-8">
        {language === "ar" ? "عربة التسوق" : "Your Shopping Cart"}
      </h1>

      <div className="grid grid-cols-12 gap-2 sm:gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-300 w-full text-xs sm:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-1 sm:p-3 text-center">
                    {language === "ar" ? "المنتج" : "Product"}
                  </th>
                  <th className="border border-gray-300 p-1 sm:p-3 text-center">
                    {language === "ar" ? "العدد" : "Qty"}
                  </th>
                  <th className="border border-gray-300 p-1 sm:p-3 text-center">
                    {language === "ar" ? "السعر" : "Price"}
                  </th>
                  <th className="border border-gray-300 p-1 sm:p-3 text-center">
                    {language === "ar" ? "الإجمالي" : "Total"}
                  </th>
                  <th className="border border-gray-300 p-1 sm:p-3 text-center">
                    {language === "ar" ? "حذف" : "Remove"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((productData) => {
                  const product = productData.data.products;
                  const cartItem = cart.find((item) => item.id === product.id);

                  return (
                    <tr key={product.id} className="text-center hover:bg-gray-100">
                      <td className="border border-gray-300 p-1 sm:p-3">
                        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
                          <img
                            src={product.photos[0]?.url || defaultImage}
                            alt={product.title}
                            className="w-12 h-12 sm:w-20 sm:h-20 object-cover rounded-md"
                          />
                          <span className="text-[10px] sm:text-base">
                            <span className="block sm:hidden">{truncateTitle(product.title)}</span>
                            <span className="hidden sm:block">{product.title}</span>
                          </span>
                        </div>
                      </td>

                      <td className="border border-gray-300 p-1 sm:p-3">
                        <div className="flex border max-w-[80px] sm:max-w-[108px] mx-auto">
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 1) {
                                updateQuantity(product.id, cartItem.quantity - 1);
                              }
                            }}
                            className="bg-gray-200 px-1 sm:px-2 text-xs sm:text-lg font-bold hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="px-6 text-[1rem]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                            className="bg-gray-200 px-1 sm:px-2 text-xs sm:text-lg font-bold hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="border border-gray-300 p-1 sm:p-3 text-[10px] sm:text-base">
                        { product.special_price > 0 ? product.special_price: product.price} {currencyData}
                      </td>

                   <td className="border border-gray-300 p-1 sm:p-3 font-semibold text-[10px] sm:text-base">
                      {((product.special_price > 0 ? product.special_price : product.price) * cartItem.quantity).toFixed(2)} {currencyData}
                    </td>

                      <td className="border border-gray-300 p-1 sm:p-3">
                        <button
                          className="text-red-500 hover:text-red-700 font-medium text-[10px] sm:text-base"
                          onClick={() => removeFromCart(product.id)}
                        >
                          {language === "ar" ? "حذف" : "Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="p-2 sm:p-5 rounded-md shadow-lg hover:shadow-xl">
            <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-center">
              {language === "ar" ? "إجمالي السلة" : "Cart Summary"}
            </h2>
            <div className="flex justify-between mb-2 sm:mb-3 text-xs sm:text-base">
              <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}:</span>
              <span>
                {getTotalPrice} {currencyData}
              </span>
            </div>
            <div className="flex justify-between mb-2 sm:mb-3 text-xs sm:text-base">
              <span>{language === "ar" ? "الضرائب" : "Taxes"}:</span>
              <span>
                 % {settings_domain?.data.tax} 
              </span>
            </div>
            <hr className="my-2 sm:my-3 border-gray-500" />
            <div className="flex justify-between text-sm sm:text-lg font-bold">
              <span>{language === "ar" ? "الإجمالي" : "Total"}:</span>
              <span>
                {getTotalPrice} {currencyData}
              </span>
            </div>

            <Link
              to={"/CartLayout"}
              className="w-full bg-primary text-white py-1.5 sm:py-2 rounded-md mt-3 sm:mt-5 hover:bg-primary-dark block text-center text-xs sm:text-base"
            >
              {language === "ar" ? "الإنتقال لعملية الدفع" : "Proceed to Checkout"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}