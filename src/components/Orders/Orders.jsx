import { useContext, useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { language } = useLanguage(); // الحصول على اللغة من السياق
  const { userToken } = useContext(ContextData);
  const [isPointsSystem, setIsPointsSystem] = useState(false);

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
        setIsPointsSystem(isPoints === 1);
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
