import { useEffect, useContext, useState } from 'react';
import {  useParams } from 'react-router-dom';
import { ContextData } from "../../context/ContextApis";
import { useLanguage } from "../../context/LanguageContextPro";
import axios from "axios";


function ShowOrder() {
    const { id } = useParams();
    const { language } = useLanguage();
    const { userToken, currencyData,api_key } = useContext(ContextData);
    const [orderData, setOrderData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `https://tarshulah.com/api/customer/order/show/${id}`,
                    {
                        headers: {
                            "Authorization": userToken,
                            "lang": language,
                            APP_KEY:api_key
                        },
                    }
                );
                const resData = await response?.data?.data?.order;
                setOrderData(resData);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, language, userToken]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        const statusMap = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'default': 'bg-gray-100 text-gray-800'
        };
        return statusMap[status?.toLowerCase()] || statusMap.default;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {language === "ar" ? "معلومات الطلب" : "Order Information"}
                        </h1>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <span className="text-gray-500">
                                {language === "ar" ? "رقم الطلب:" : "Order ID:"}
                            </span>
                            <span className="font-mono font-semibold text-yellow-600">
                                #{orderData?.order_no}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
                    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm">
                        <span className="text-sm text-gray-500 mb-2">
                            {language === "ar" ? "حالة الطلب" : "Order Status"}
                        </span>
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData?.order_status)}`}>
                            {orderData?.order_status}
                        </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm">
                        <span className="text-sm text-gray-500 mb-2">
                            {language === "ar" ? "حالة السداد" : "Payment Status"}
                        </span>
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData?.payment_status)}`}>
                            {orderData?.payment_status}
                        </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm">
                        <span className="text-sm text-gray-500 mb-2">
                            {language === "ar" ? "تاريخ الطلب" : "Order Date"}
                        </span>
                        <span className="font-medium text-gray-700">{orderData?.created_at}</span>
                    </div>
                </div>

                {/* Shipping and Payment Info */}
                <div className="grid md:grid-cols-2 gap-8 p-6">
                    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {language === "ar" ? "معلومات الشحن" : "Shipping Information"}
                        </h2>
                        <div className="space-y-3 text-gray-600">
                            <p>{orderData?.order_content?.address}</p>
                            <p>
                                {language === "ar" ? "المدينة:" : "City:"} {' '}
                                <span className="font-medium">
                                    {language === "ar" ? orderData?.shipping_info?.city?.name_ar : orderData?.shipping_info?.city?.name_en}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {language === "ar" ? "معلومات الدفع" : "Payment Information"}
                        </h2>
                        <div className="space-y-3 text-gray-600">
                            <p>
                                {language === "ar" ? "طريقة الدفع:" : "Payment Method:"} {' '}
                                <span className="font-medium">{orderData?.payment_method}</span>
                            </p>
                            <p>
                                {language === "ar" ? "رقم المعاملة:" : "Transaction ID:"} {' '}
                                <span className="font-mono">{orderData?.transaction_id}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {language === "ar" ? "ملخص الطلب" : "Order Summary"}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === "ar" ? "المنتج" : "Product"}
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === "ar" ? "المبلغ" : "Amount"}
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === "ar" ? "الإجمالي" : "Total"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orderData?.order_items?.map((orderItem) => (
                                    <tr key={orderItem?.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {language === "ar" ? orderItem?.term?.title_ar : orderItem?.term?.title_en}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            
                                                {orderItem.amount} {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name} x {orderItem.qty} 
                                            
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {String(Number(orderItem.amount) * Number(orderItem.qty))} {' '}
                                            {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-6 flex justify-end">
                    <div className="bg-white rounded-xl shadow-sm px-6 py-4">
                        <span className="text-gray-600">
                            {language === "ar" ? "الإجمالي:" : "Total:"} {' '}
                        </span>
                        <span className="text-xl font-bold text-yellow-600">
                            {orderData?.total} {language === 'ar' ? currencyData?.currency_icon:currencyData?.currency_name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowOrder;