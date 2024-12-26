import React, { useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import axios from "axios";
import { IoEyeSharp } from 'react-icons/io5';
import { IoIosHeart } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { useCart } from '../../context/CartContext';
import { useLocation } from 'react-router-dom';

function ShowOrder() {
    const { id } = useParams();
    const { language, toggleLanguage } = useLanguage();
    const { userData, currencyDataEnglish, currencyData } = useContext(ContextData);
    const { userToken } = useContext(ContextData);
    const [orderData, setOrderData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://tarshulah.com/api/customer/order/show/${id}`,
                    {
                        headers: {
                            "Authorization": userToken,
                            "lang": language
                        },
                    }
                );
                console.log(response);
                const resData = await response?.data?.data?.order;
                console.log(resData);
                setOrderData(resData);
                console.log(orderData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return (
        <>
            {language === "ar" ? <div className='flex flex-row bg-white justify-between'>
                <p className='text-black text-xl font-bold'>معلومات الطلب</p>
                <p className='text-black text-sm'>رقم التعريف الخاص بالطلب ID: {orderData?.order_no}</p>
            </div> : <div className='flex flex-row bg-white justify-between'>
                <p className='text-black text-xl font-bold'>Order information</p>
                <p className='text-black text-sm'>ID: Order ID {orderData?.order_no}</p>
            </div>}
            <hr></hr>
            <div className='bg-white'>
                <div className='flex flex-row bg-white justify-between'>
                    <div className='bg-white'>
                        <p className='text-black'>{language === "ar" ? "تم الشحن الى:" : "Shipped to:"}</p>
                        <p className='text-black'>{orderData?.order_content?.address}</p>
                        <p className='text-black'>{language === "ar" ? "المدينة:" : "City:"} {language === "ar" ? orderData?.shipping_info?.city?.name_ar : orderData?.shipping_info?.city?.name_en}</p>
                        <p className='text-black'>{language === "ar" ? "الرمز البريدى:" : "zip code:"}</p>
                        <p className='text-black'>Address: {orderData?.order_content?.address}</p>
                        <br></br>
                        <br></br>
                        <p className='text-black'>{language === "ar" ? "معلومات الدفع:" : "Payment Info:"}</p>
                        <p className='text-black'>{language === "ar" ? "طريقة الدفع:" : "payment method:"} {orderData?.payment_method}</p>
                        <p className='text-black'>{language === "ar" ? "رقم المعاملة:" : "Transaction number:"} {orderData?.transaction_id}</p>
                    </div>
                    <div className='bg-white mx-24'>
                        <p className='text-black'>{language === "ar" ? "حالة الطلب:" : "Order Status:"}</p>
                        <p className='text-black bg-yellow rounded-md'>{orderData?.order_status}</p>
                        <br></br>
                        <br></br>
                        <p className='text-black'>{language === "ar" ? "حالة السداد:" : "Payment status:"}</p>
                        <p className='text-black bg-yellow rounded-md'>{orderData?.payment_status}</p>
                        <br></br>
                        <p className='text-black'>{language === "ar" ? "تاريخ الطلب:" : "Order date:"}</p>
                        <p className='text-black'>{orderData?.created_at}</p>
                    </div>
                </div>
                <br></br>
                <br></br>
                <div className='bg-white flex flex-col'>
                    <p className='text-black'>{language === "ar" ? "ملخص الطلب" : "Application Summary"}</p>
                    <div className="relative ">
                        <table className="w-3/4 md:w-full text-gray-500 text-[0.6rem]">
                            <thead className=" text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-1 md:px-6 py-3">الاسم</th>
                                    <th className="px-1 md:px-6 py-3">المبلغ</th>
                                    <th className="px-1 md:px-6 py-3">الإجمالي</th>
                                    {/* <th className="px-6 py-3">المنتجات</th> */}
                                    {/* <th className="px-6 py-3">معلومات الشحن</th> */}
                                    {/* <th className="px-6 py-3">محتوى الطلب</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {orderData?.order_items?.map((order) => (
                                    <tr key={order?.id} className="bg-white border-b">
                                        <td className="px-1 md:px-6 py-4 text-black text-sm">{language === "ar" ? order.term.title_ar : order.term.title_en}</td>
                                        <td className="px-1 md:px-6 py-4 text-black text-sm">{language === "ar" ? `${order.amount} ${currencyData} x ${order.qty}` : `${order.amount} ${currencyDataEnglish} x ${order.qty}`}</td>
                                        <td className="px-1 md:px-6 py-4 text-black text-sm">{String(Number(order.amount) * Number(order.qty))} {language === "ar" ? `${currencyData}` : `${currencyDataEnglish}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <br></br>
                <br></br>
                <div className="flex flex-col items-end self-end">
                    <p className='text-black w-60'>{language === "ar" ? "الإجمالي:" : "Total:"} <span className='bg-yellow'>{orderData?.total} {language === "ar" ? `${currencyData}` : `${currencyDataEnglish}`}</span></p>
                </div>
                <br></br>
                <br></br>
            </div>
        </>
    )
};

export default ShowOrder;
