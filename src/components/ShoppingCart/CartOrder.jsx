import { useContext, useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";

export default function CartOrder({updateTotal}) {
  const { cart, getTotalPrice, currencyData } = useCart();
    const {settings_domain } = useContext(ContextData);
  
  const [total, setTotal] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const calculatedTotal = getTotalPrice().toFixed(2);
    setTotal(calculatedTotal);
  }, [getTotalPrice, cart]);

  return (
    <div className=" bg-white ">
      {/* <h2 className="text-2xl font-semibold mb-4">ملخص الطلب</h2> */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 ">{language === "ar" ? "المنتج ":"Product"}</th>
            <th className="border px-4 py-2 ">{language === "ar" ? "الكمية ":"Quantity"}</th>
            <th className="border px-4 py-2 ">{language === "ar" ? "الاجمالي":"Total"}</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2 font-semibold">{item.title}</td>
              <td className="border px-4 py-2 text-slate-500 text-center">{item.quantity}</td>
              <td className="border px-4 py-2 text-slate-500 text-center">{(item.quantity * item.price).toFixed(2)} {currencyData}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2" className="border px-4 py-2 font-semibold">{language === "ar" ? "الضريبة ":"Tax"}</td>
            <td className="border px-4 py-2 font-semibold text-center">{settings_domain?.data.tax}</td>
          </tr>
          <tr>
            <td colSpan="2" className="border px-4 py-2 font-semibold">{language === "ar" ? "المبلغ الاجمالي":"Total Amount"}</td>
            <td className="border px-4 py-2 font-semibold text-center">{updateTotal}{currencyData}</td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
}
