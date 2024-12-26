import { useContext, useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { language } = useLanguage(); // الحصول على اللغة من السياق
  const { userToken } = useContext(ContextData);
  const [isPointsSystem, setIsPointsSystem] = useState(false);
  const handleClick =
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
          setOrders(ordersJson.data?.orders || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        try {
          const res = await fetch("https://tarshulah.com/api/domain/settings");
          const resJson = await res.json();
          const isPoints = await resJson.data.points_system;
          if (isPoints == 1) {
            setIsPointsSystem(true);
          }
          else {
            setIsPointsSystem(false);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, [userToken, language]);

  return (
    <div className="mt-10 w-full">
      {isPointsSystem && (
        <h2 className="my-2 font-semibold">
          {language === "ar" ? "النقاط المتاحة: " : "Available Points: "}
        </h2>
      )}
      <div className="relative ">
        <table className="w-3/4 md:w-full text-gray-500 text-[0.9rem]">
          <thead className=" text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-1 md:px-6 py-3">
                {language === "ar" ? "رقم الطلب" : "Order Number"}
              </th>
              <th className="px-1 md:px-6 py-3">
                {language === "ar" ? "الحالة" : "Status"}
              </th>
              <th className="px-1 md:px-6 py-3">
                {language === "ar" ? "طريقة الدفع" : "Payment Method"}
              </th>
              <th className="px-1 md:px-6 py-3">
                {language === "ar" ? "الإجمالي" : "Total"}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order?.id} className="bg-white border-b">
                <td className="px-1 md:px-6 py-4">{order?.order_no || "N/A"}</td>
                <td className="px-1 md:px-6 py-4">{order?.order_status || "N/A"}</td>
                <td className="px-1 md:px-6 py-4">{order?.payment_method || "N/A"}</td>
                <td className="px-1 md:px-6 py-4">{order?.total}</td>
                <td className="px-1 md:px-6 py-4"><Link to={`/ShowOrder/${order.id}`} className="bg-primary rounded-md flex items-center justify-center py-3 px-2 hover:shadow-md ">
                  <p className="text-white text-center font-bold text-xs">{language === "ar" ? "تفاصيل الطلب" : "Order Details"}</p>
                </Link></td>

                {/* <td className="px-6 py-4">
                  {order?.order_items?.length > 0 ? (
                    order.order_items.map((item) => (
                      <div key={item?.id || Math.random()}>
                        <span>المنتج: {item?.term?.title_ar || "N/A"}</span> <br />
                        <span>الكمية: {item?.qty || "N/A"}</span> <br />
                        <span>السعر: {item?.amount || "N/A"}</span>
                      </div>
                    ))
                  ) : (
                    <span>لا توجد منتجات</span>
                  )}
                </td> */}

                {/* <td className="px-6 py-4">
                  <div>
                    <span>المدينة: {order?.shipping_info?.city?.name || "N/A"}</span> <br />
                    <span>طريقة الشحن: {order?.shipping_info?.shipping_method?.name || "N/A"}</span>
                  </div>
                </td> */}

                {/* <td className="px-6 py-4">
                  <div>
                    <span>الاسم: {order?.order_content?.name || "N/A"}</span> <br />
                    <span>الهاتف: {order?.order_content?.phone || "N/A"}</span> <br />
                    <span>العنوان: {order?.order_content?.address || "N/A"}</span>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
