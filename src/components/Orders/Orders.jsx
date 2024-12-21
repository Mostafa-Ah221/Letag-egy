import { useContext, useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { language } = useLanguage();
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
    <div className="mt-10">
      {isPointsSystem ? <h2 className="my-2 text-lg font-semibold">النقاط المتاحة: </h2> : <></>}
      <div className="relative ">
        <table className="w-full text-gray-500">
          <thead className=" text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">رقم الطلب</th>
              <th className="px-6 py-3">الحالة</th>
              <th className="px-6 py-3">طريقة الدفع</th>
              <th className="px-6 py-3">الإجمالي</th>
              {/* <th className="px-6 py-3">المنتجات</th> */}
              {/* <th className="px-6 py-3">معلومات الشحن</th> */}
              {/* <th className="px-6 py-3">محتوى الطلب</th> */}
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order?.id} className="bg-white border-b">
                <td className="px-6 py-4">{order?.order_no || "N/A"}</td>
                <td className="px-6 py-4">{order?.order_status || "N/A"}</td>
                <td className="px-6 py-4">{order?.payment_method || "N/A"}</td>
                <td className="px-6 py-4">{order?.total}</td>

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
