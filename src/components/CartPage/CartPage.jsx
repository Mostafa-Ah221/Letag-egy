
import { useContext } from "react";
import { useCart } from "../../context/CartContext";
import { ContextData } from "../../context/ContextApis";


export default function CartPage() {
  const { cart, removeFromCart, updateQuantity,getTotalPrice } = useCart();
  const { currencyData } = useContext(ContextData);


  return (
    <div className="w-full relative">
      <div className="my-9">
        <h1 className="font-bold text-3xl">تحقق من عربة التسوق الخاص بك</h1>
      </div>
         {cart.length > 0 ? (
            <div className="grid grid-cols-12 gap-7 px-5">
            <div className="space-y-4 col-span-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center border p-4 hover:shadow-md transition-shadow duration-300"
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
                      {item.price} {currencyData}
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
            <div className="col-span-4 border p-4 hover:shadow-md transition-shadow duration-300 h-fit">
                <h2 className="text-center text-[1.1rem]">معلومات الطلب</h2>
            <div className="flex justify-between items-center gap-2 my-5">
              <h3>الاجمالي الفرعي :</h3>
              <span>{getTotalPrice().toFixed(2)} {currencyData}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center gap-2 my-3">
              <h3 className="text-2xl font-bold">المجموع الكلي :</h3>
              <span>{getTotalPrice().toFixed(2)} {currencyData}</span>
            </div>
           </div>
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
      </div>
  );
}
