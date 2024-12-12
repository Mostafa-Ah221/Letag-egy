import { useContext, useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";

function Orders() {
  const [orders, setOrders] = useState([]); 
  const { language } = useLanguage();
  const { userToken } = useContext(ContextData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userToken) {
          console.error("User token is missing!");
          return;
        }

        const ordersRes = await fetch("https://tarshulah.com/api/customer/orders", {
          headers: {
            "Authorization": userToken,
          },
        });

        if (!ordersRes.ok) {
          throw new Error("Failed to fetch orders");
        }

        const ordersJson = await ordersRes.json();
        console.log("Data In API:", ordersJson);
        setOrders(ordersJson.data.orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userToken, language]);

  return (
    <>
      <h2 className="my-2 text-lg font-semibold">طلبات العملاء</h2>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">رقم الطلب</th>
              <th className="px-6 py-3">تاريخ الطلب</th>
              <th className="px-6 py-3">الحالة</th>
              <th className="px-6 py-3">طريقة الدفع</th>
              <th className="px-6 py-3">الإجمالي</th>
              <th className="px-6 py-3">المنتجات</th>
              <th className="px-6 py-3">معلومات الشحن</th>
              <th className="px-6 py-3">محتوى الطلب</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b">
                <td className="px-6 py-4">{order.order_no}</td>
                <td className="px-6 py-4">{order.created_at}</td>
                <td className="px-6 py-4">{order.order_status}</td>
                <td className="px-6 py-4">{order.payment_method}</td>
                <td className="px-6 py-4">{order.total}</td>

                <td className="px-6 py-4">
                  {order.order_items.map((item) => (
                    <div key={item.id}>
                      <span>المنتج: {item.term.title_ar}</span> <br />
                      <span>الكمية: {item.qty}</span> <br />
                      <span>السعر: {item.amount}</span>
                    </div>
                  ))}
                </td>

                <td className="px-6 py-4">
                  <div>
                    <span>المدينة: {order.shipping_info.city.name}</span> <br />
                    <span>طريقة الشحن: {order.shipping_info.shipping_method.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div>
                    <span>الاسم: {order.order_content.name}</span> <br />
                    <span>الهاتف: {order.order_content.phone}</span> <br />
                    <span>العنوان: {order.order_content.address}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Orders;
