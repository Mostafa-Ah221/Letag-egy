import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

export default function CartOrder() {
  const { cart, getTotalPrice, currencyData } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedTotal = getTotalPrice().toFixed(2);
    setTotal(calculatedTotal);
  }, [getTotalPrice, cart]);

  return (
    <div className=" bg-white mt-14">
      {/* <h2 className="text-2xl font-semibold mb-4">ملخص الطلب</h2> */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 ">المنتج</th>
            <th className="border px-4 py-2 ">الكمية</th>
            <th className="border px-4 py-2 ">الاجمالي</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2 font-semibold">{item.title}</td>
              <td className="border px-4 py-2 text-slate-500">{item.quantity}</td>
              <td className="border px-4 py-2 text-slate-500">{(item.quantity * item.price).toFixed(2)} {currencyData}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2" className="border px-4 py-2 font-semibold text-right">المبلغ الاجمالي</td>
            <td className="border px-4 py-2 font-semibold">{total}{currencyData}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
