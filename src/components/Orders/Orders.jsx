import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useLanguage } from "../../context/LanguageContextPro";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [points, setPoints] = useState(0);
    const [isPointsSystem, setIsPointsSystem] = useState(false);
    const token = localStorage.getItem("userToken");
    const { language, toggleLanguage } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            console.log(token);
            try {
                const res = await fetch("https://tarshulah.com/api/domain/settings");
                const resJson = await res.json();
                const resData = await resJson.data;
                const isPoints = await resData.points_system;
                if (isPoints == 1) {
                    setIsPointsSystem(true);
                } else {
                    setIsPointsSystem(false);
                }
                const res2 = await axios.get("http://tarshulah.com/api/customer/orders", {
                    headers: {
                        "Authorization": token,
                        "lang": language,
                    }
                });
                const resData2 = await res2.data;
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);
    return (
        <>
            <h2 className={`${isPointsSystem ? "block" : "hidden"}`}>النقاط المتاحة: {points}</h2>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                عرض
                            </th>
                            <th scope="col" className="px-6 py-3">
                                النقاط المدفوعة
                            </th>
                            <th scope="col" className="px-6 py-3">
                                النقاط المكتسبة
                            </th>
                            <th scope="col" className="px-6 py-3">
                                حالة الطلب
                            </th>
                            <th scope="col" className="px-6 py-3">
                                حالة السداد
                            </th>
                            <th scope="col" className="px-6 py-3">
                                طريقة الدفع
                            </th>
                            <th scope="col" className="px-6 py-3">
                                المبلغ
                            </th>
                            <th scope="col" className="px-6 py-3">
                                رقم التعريف الخاص بالطلب ID
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Apple MacBook Pro 17"
                            </th>
                            <td className="px-6 py-4">
                                Silver
                            </td>
                            <td className="px-6 py-4">
                                Laptop
                            </td>
                            <td className="px-6 py-4">
                                $2999
                            </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Microsoft Surface Pro
                            </th>
                            <td className="px-6 py-4">
                                White
                            </td>
                            <td className="px-6 py-4">
                                Laptop PC
                            </td>
                            <td className="px-6 py-4">
                                $1999
                            </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Magic Mouse 2
                            </th>
                            <td className="px-6 py-4">
                                Black
                            </td>
                            <td className="px-6 py-4">
                                Accessories
                            </td>
                            <td className="px-6 py-4">
                                $99
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Orders
