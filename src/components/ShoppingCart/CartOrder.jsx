import { useContext, useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";
import { useOutletContext } from "react-router-dom";

export default function CartOrder() {
  const { cart, getTotalPrice, currencyData } = useCart();
    const {settings_domain } = useContext(ContextData);
      const {updatedTotal,appliedDiscount,totalBeforeDiscount} = useOutletContext();
    
  
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
  <td colSpan="2" className="border px-4 py-2 font-semibold">
    {appliedDiscount > 0 ? (
      <div>
        {/* عرض السعر القديم بخط مشطوب */}
        <span className=" hidden">{language === "ar" ? "المبلغ الإجمالي  :" : "Total Amount  :"}</span>
        {/* عرض السعر الجديد */}
        <span className=" "> <span>{language === "ar" ? "المبلغ الإجمالي بعد الخصم:" : "Total Amount After Discount:"}</span></span>
      </div>
    ) : (
      // إذا لم يكن هناك خصم، عرض السعر فقط
       <span>{language === "ar" ? "المبلغ الإجمالي  :" : "Total Amount  :"}</span>
    )}
    
  </td>
  <td className="border px-4 py-2 font-semibold text-center">
    {appliedDiscount > 0 ? (
      <div>
        {/* عرض السعر القديم بخط مشطوب */}
        <span className="text-red-500 line-through mr-2">{totalBeforeDiscount} {currencyData}</span>
        {/* عرض السعر الجديد */}
        <span className="text-green-500 font-bold">{updatedTotal} {currencyData}</span>
      </div>
    ) : (
      // إذا لم يكن هناك خصم، عرض السعر فقط
      <span className="text-black">{updatedTotal} {currencyData}</span>
    )}
  </td>
</tr>

          
        </tbody>
      </table>
    </div>
  );
}
