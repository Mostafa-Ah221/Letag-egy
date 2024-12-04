import { useContext } from "react";
import { useCart } from "../../context/CartContext";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { currencyData, getProdDetails } = useContext(ContextData);
  const { language } = useLanguage();

  const ids = cart.map((item) => item.id);

  const { data: productsData, isError, isLoading } = useQuery({
    queryKey: ["getProdDetails", ids, language],
    queryFn: () => Promise.all(ids.map((id) => getProdDetails(id, language))),
    enabled: ids.length > 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (isError) return <div>{language === "ar" ? "حدث خطأ أثناء تحميل البيانات." : "An error occurred while loading the data."}</div>;

  return (
    <div className="w-full relative">
      <div className="my-9">
        <h1 className="font-bold text-3xl text-center md:text-start">
          {language === "ar" ? "تحقق من عربة التسوق الخاص بك" : "Check Your Cart"}
        </h1>
      </div>
      {cart.length > 0 && productsData ? (
        <div className="grid grid-cols-12 gap-7 px-5">
          <div className="space-y-4 col-span-12 md:col-span-8 ">
            {productsData.map((productData, index) => {
              const product = productData.data.products;
              const cartItem = cart.find((item) => item.id === product.id);

              return (
                <div
                  key={product.id}
                  className="flex gap-4 items-center border p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={product.photos[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                   <h3 className="text-lg font-medium break-words">{product.title}</h3>
                    <span className="text-primary text-lg font-semibold">
                      {product.price} {currencyData}
                    </span>
                    <div className="flex items-center gap-4 mt-2">
                      {/* حقل التحكم في الكمية */}
                      <input
                        type="number"
                        value={cartItem.quantity} // عرض الكمية الحالية
                        onChange={(e) => {
                          const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
                          updateQuantity(product.id, newQuantity); // تحديث الكمية للمنتج الحالي
                        }}
                        min={1}
                        className="w-16 text-center py-1 px-2 border border-gray-300 rounded-md shadow-sm"
                      />
                      <button
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                        onClick={() => removeFromCart(product.id)}
                      >
                        {language === "ar" ? "حذف" : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-span-12 md:col-span-4 border p-4 hover:shadow-md transition-shadow duration-300 h-fit">
            <h2 className="text-center text-[1.1rem]">
              {language === "ar" ? "معلومات الطلب" : "Order Information"}
            </h2>
            <div className="flex justify-between items-center gap-2 my-5">
              <h3>{language === "ar" ? "الاجمالي الفرعي :" : "Subtotal :"}</h3>
              <span>
                {getTotalPrice().toFixed(2)} {currencyData}
              </span>
            </div>
            <hr />
            <div className="flex justify-between items-center gap-2 my-3">
              <h3 className="text-2xl font-bold">
                {language === "ar" ? "المجموع الكلي :" : "Total :"}
              </h3>
              <span>
                {getTotalPrice().toFixed(2)} {currencyData}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-600 text-lg mb-4">
            {language === "ar"
              ? "عربتك فارغة. يبدو أنك لم تقم بإضافة أي منتج بعد."
              : "Your cart is empty. It looks like you haven't added any products yet."}
          </p>
          <img
            src="https://img.freepik.com/free-vector/shopping-supermarket-cart-with-grocery-pictogram_1284-11697.jpg?ga=GA1.1.812912771.1724576833&semt=ais_hybrid"
            alt="Cart Empty"
            className="w-48 mx-auto"
          />
        </div>
      )}
    </div>
  );
}
