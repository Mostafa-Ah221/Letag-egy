import { useState, useEffect, useContext, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ContextData } from '../../context/ContextApis';

export default function CartLayout() {
  const { cart, getTotalPrice, showToast } = useCart();
  const { userToken, userData, settings_domain } = useContext(ContextData);
  const tax = settings_domain?.data.tax;

  const [updatedTotal, setUpdatedTotal] = useState(getTotalPrice().toFixed(2));
  const [baseTotal, setBaseTotal] = useState(getTotalPrice().toFixed(2));
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    shipping_id: '',
    shipping_price: '',
    location_id: '',
    delivery_address: '',
    payment_method: '',
    product_data: [],
    total: '',
    coupon_discount: '',
    comment: '',
    address_id: '',
    building_number: '',
    floor_number: '',
  });

  const [required, setRequired] = useState({});

  // Memoize total price
  const totalPrice = useMemo(() => getTotalPrice().toFixed(2), [cart]);

  useEffect(() => {
    setBaseTotal(totalPrice);
    setFormData((prev) => ({ ...prev, total: totalPrice }));
  }, [totalPrice]);

  // Memoize product data
  const products = useMemo(
    () =>
      cart.map((item) => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    [cart]
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product_data: products,
    }));
  }, [products]);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        first_name: userData.name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      }));
    }
  }, [userData]);

  // تحديث طريقة حساب السعر النهائي
  useEffect(() => {
    const calculateTotal = () => {
      // 1. حساب السعر الأساسي مع الضريبة
      const taxPercentage = parseFloat(tax || 0);
      const totalWithTax = parseFloat(baseTotal) * (1 + taxPercentage / 100);
      
      // 2. تطبيق الخصم إذا وجد
      const totalAfterDiscount = totalWithTax * (1 - appliedDiscount / 100);
      
      // 3. إضافة سعر الشحن
      const shippingPrice = parseFloat(formData.shipping_price || 0);
      const finalTotal = (totalAfterDiscount + shippingPrice).toFixed(2);
      
      return finalTotal;
    };

    const newTotal = calculateTotal();
    setUpdatedTotal(newTotal);
    setFormData(prev => ({ ...prev, total: newTotal }));
  }, [baseTotal, tax, formData.shipping_price, appliedDiscount]);

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // باقي الكود للvalidation يظل كما هو
  const validateFields = () => {
    const requiredFields = [
      'first_name',
      'last_name',
      'phone',
      'email',
      'delivery_address',
      'product_data',
      'location_id',
      'payment_method',
    ];
    const newErrors = {};
    for (let field of requiredFields) {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = `حقل ${field} مطلوب.`; 
      }
    }
    setRequired(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewSubmit = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch('https://tarshulah.com/api/order/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
// console.log(formData);

      if (response.ok) {
        showToast('تم إرسال الطلب بنجاح');
      } else {
        showToast(responseData.message || 'تعذر إرسال الطلب.');
      }
    } catch (networkError) {
      console.error('Network Error:', networkError);
      alert('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleCouponButton = async () => {
    if (!formData.coupon_discount) {
      showToast("يرجى إدخال رمز القسيمة.");
      return;
    }

    try {
      const response = await fetch("https://tarshulah.com/api/coupon/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.coupon_discount,
          total_cart: baseTotal, // إرسال السعر الأساسي بدون شحن
        }),
      });

      const responseData = await response.json();

      if (responseData.status) {
        const discount = responseData.data.coupon.precentage;
        setAppliedDiscount(discount);
        setFormData(prev => ({
          ...prev,
          coupon_discount: discount,
        }));
        showToast("تم تطبيق القسيمة بنجاح!");
      } else {
        alert(responseData.message || "تعذر تطبيق القسيمة.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("خطأ في الشبكة. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div>
      <Outlet context={{ updateData, handleReviewSubmit, handleCouponButton, formData, required, updatedTotal }} />
    </div>
  );
}