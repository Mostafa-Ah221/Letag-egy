import { useContext, useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";
import { useOutletContext } from "react-router-dom";

export default function CartOrder() {
  const { cart, getTotalPrice } = useCart();
  const { settings_domain,currencyData } = useContext(ContextData);
  const { updatedTotal, appliedDiscount, totalBeforeDiscount, payPoint,shippingPrice } = useOutletContext();
  const [total, setTotal] = useState(0);
  const { language } = useLanguage();
console.log(currencyData);

  useEffect(() => {
    const calculatedTotal = getTotalPrice;
    setTotal(calculatedTotal);
  }, [getTotalPrice, cart]);

  // Helper function to get the appropriate total label based on payment method
  const getTotalLabel = () => {
    if (payPoint) {
      return language === "ar" 
        ? "المبلغ الإجمالي بعد خصم النقاط:" 
        : "Total Amount After Points Discount:";
    }
    if (appliedDiscount > 0) {
      return language === "ar"
        ? "المبلغ الإجمالي بعد الكوبون:"
        : "Total Amount After Coupon:";
    }
    return language === "ar" ? "المبلغ الإجمالي:" : "Total Amount:";
  };

  return (
    <div className="bg-white">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">{language === "ar" ? "المنتج" : "Product"}</th>
            <th className="border px-4 py-2">{language === "ar" ? "الكمية" : "Quantity"}</th>
            <th colSpan={3} className="border px-4 py-2">{language === "ar" ? "الاجمالي" : "Total"}</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2 font-semibold w-full">{item.title}</td>
              <td className="border px-4 py-2 text-slate-500 text-center">{item.quantity}</td>
          <td className="border px-4 py-2 text-slate-500 text-center">
            {Number(item.special_price) > 0 ? (
              <>
                {/* السعر القديم مع خط عليه */}
                <span className="line-through text-red-500 m-2">
                  {(Number(item.quantity) || 0) * (Number(item.price) || 0).toFixed(2)}{"  "}
                  {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}
                </span>
                
                {/* السعر الجديد */}
                <span className="text-green-500">
                  {(Number(item.quantity) || 0) * (Number(item.special_price) || 0).toFixed(2)}{"  "}
                  {language === 'ar' ? currencyData.currency_icon:currencyData?.currency_name || ""}
                </span>
              </>
            ) : (
              <>
                {/* السعر العادي بدون خصم */}
                {(Number(item.quantity) || 0) * (Number(item.price) || 0).toFixed(2)}{" "}
                {language === 'ar' ? currencyData.currency_icon:currencyData?.currency_name || ""}
              </>
            )}
          </td>

            </tr>
          ))}
          <tr>
            <td colSpan="2" className="border px-4 py-2 font-semibold">
              {language === "ar" ? "الضريبة" : "Tax"}
            </td>
            <td className="border px-4 py-2 font-semibold text-center">
             % {settings_domain?.data.tax} 
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="border px-4 py-2 font-semibold">
              {language === "ar" ? "الشحن" : "shipping"}
            </td>
            <td className="border px-4 py-2 font-semibold text-center">
              {shippingPrice}
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="border px-4 py-2 font-semibold">
              {getTotalLabel()}
            </td>
            <td className="border px-4 py-2 font-semibold text-center">
              {(appliedDiscount > 0 || payPoint) && (
                <span className="text-red-500 text-[14px] line-through m-2 inline-block w-full">
                  {totalBeforeDiscount} {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}
                </span>
              )}
              <span className={appliedDiscount > 0 || payPoint ? "text-green-500 font-bold inline-block w-full" : "text-black"}>
                {payPoint ? payPoint : updatedTotal} {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}