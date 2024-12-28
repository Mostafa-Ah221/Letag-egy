import { useContext, useState } from "react";
import { useCart } from "../../context/CartContext";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { Link } from "react-router-dom";
import LoadingIndicator from "../Loading/LoadingIndicator";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { currencyData, getProdDetails } = useContext(ContextData);
  const { language } = useLanguage();
    const [quantity, setQuantity] = useState(1);
  

  const ids = cart.map((item) => item.id);

  const { data: productsData, isError, isLoading } = useQuery({
    queryKey: ["getProdDetails", ids, language],
    queryFn: () => Promise.all(ids.map((id) => getProdDetails(id, language))),
    enabled: ids.length > 0,
  });

  if (isLoading) {
    return (
      <LoadingIndicator/>
    );
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
    <div className="w-full px-5 my-10">
      {/* العنوان */}
      <h1 className="font-bold text-3xl text-center mb-8">
        {language === "ar" ? "عربة التسوق" : "Your Shopping Cart"}
      </h1>

      {/* جدول السلة */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3 text-center">{language === "ar" ? "المنتج" : "Product"}</th>
                <th className="border border-gray-300 p-3 text-center">{language === "ar" ? "العدد" : "Quantity"}</th>
                <th className="border border-gray-300 p-3 text-center">{language === "ar" ? "السعر" : "Price"}</th>
                <th className="border border-gray-300 p-3 text-center">{language === "ar" ? "الإجمالي" : "Total"}</th>
                <th className="border border-gray-300 p-3 text-center">{language === "ar" ? "حذف" : "Remove"}</th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((productData) => {
                const product = productData.data.products;
                const cartItem = cart.find((item) => item.id === product.id);

                return (
                  <tr key={product.id} className="text-center hover:bg-gray-100">
                    {/* صورة المنتج */}
                    <td className="border border-gray-300 p-3 flex items-center justify-start">
                      <img
                        src={product.photos[0].url}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <span className="ml-4">{product.title}</span>
                    </td>

                    {/* الكمية */}
                    <td className="border border-gray-300 p-3">
                        <div className="flex border">
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 1) {
                                updateQuantity(product.id, cartItem.quantity - 1);
                              }
                            }}
                            className="bg-gray-200 px-2 text-lg font-bold hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="px-6 text-[1rem]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                            className="bg-gray-200 px-2 text-lg font-bold hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>


                    {/* السعر */}
                    <td className="border border-gray-300 p-3">
                      {product.price} {currencyData}
                    </td>

                    {/* الإجمالي */}
                    <td className="border border-gray-300 p-3 font-semibold">
                      {(product.price * cartItem.quantity).toFixed(2)} {currencyData}
                    </td>

                    {/* زر الحذف */}
                    <td className="border border-gray-300 p-3">
                      <button
                        className="text-red-500 hover:text-red-700 font-medium"
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

        {/* معلومات الطلب */}
        <div className="col-span-12 md:col-span-4">
          <div className=" p-5 rounded-md shadow-lg hover:shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              {language === "ar" ? "إجمالي السلة" : "Cart Summary"}
            </h2>
            <div className="flex justify-between mb-3">
              <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}:</span>
              <span>{getTotalPrice().toFixed(2)} {currencyData}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span>{language === "ar" ? "الضرائب" : "Taxes"}:</span>
              <span>0.00 {currencyData}</span>
            </div>
            <hr className="my-3 border-gray-500" />
            <div className="flex justify-between text-lg font-bold">
              <span>{language === "ar" ? "الإجمالي" : "Total"}:</span>
              <span>{getTotalPrice().toFixed(2)} {currencyData}</span>
            </div>
          
            <Link to={"/CartLayout"} className="w-full bg-primary text-white py-2 rounded-md mt-5 hover:bg-primary-dark block text-center">
              {language === "ar" ? "الإنتقال لعملية الدفع" : "Proceed to Checkout"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
