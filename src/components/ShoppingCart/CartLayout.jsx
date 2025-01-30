import { useState, useEffect, useContext, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ContextData } from '../../context/ContextApis';
import { useLanguage } from '../../context/LanguageContextPro';

export default function CartLayout() {
  const { cart, getTotalPrice, showToast } = useCart();
  const { userToken, userData, settings_domain, api_key } = useContext(ContextData);
  const { language } = useLanguage();

  const tax = settings_domain?.data.tax;

  const [updatedTotal, setUpdatedTotal] = useState(getTotalPrice);
  const [baseTotal, setBaseTotal] = useState(getTotalPrice);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
  const [payPoint, setPayPoint] = useState(null);

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
  const [totalBeforeDiscount, setTotalBeforeDiscount] = useState();

  // Memoize total price
  const totalPrice = useMemo(() => getTotalPrice, [cart]);

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
        phone: userData.phone || '',
      }));
    }
  }, [userData]);
console.log(payPoint);
  useEffect(() => {
    const newShippingPrice = parseFloat(formData.shipping_price || 0);
    setShippingPrice(newShippingPrice);
  }, [formData.shipping_price]);
  // تحديث طريقة حساب السعر النهائي
  useEffect(() => {
    const calculateTotal = () => {
      const taxPercentage = parseFloat(tax || 0);
      const totalWithTax = parseFloat(baseTotal) * (1 + taxPercentage / 100);
      const shippingPrice = parseFloat(formData.shipping_price || 0);
      const totalWithShipping = totalWithTax + shippingPrice;

      setTotalBeforeDiscount(totalWithShipping.toFixed(2));

      const finalTotal = (totalWithShipping * (1 - appliedDiscount / 100)).toFixed(2);
      return finalTotal;
    };

    const newTotal = calculateTotal();
    setUpdatedTotal(newTotal);
    // لا نقوم بتحديث formData.total هنا
  }, [baseTotal, tax, formData.shipping_price, appliedDiscount]);

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

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

    // نطبع القيم قبل الإرسال للتأكد
    console.log('formData.total:', formData.total);
    console.log('updatedTotal:', updatedTotal);

    const finalData = {
      ...formData,
      total: baseTotal, // نرسل القيمة الأصلية بدون خصومات
    };

    console.log('Final data being sent:', finalData);

    try {
      const response = await fetch('https://demo.leetag.com/api/order/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
          APP_KEY: api_key,
        },
        body: JSON.stringify(finalData), // نرسل finalData بدلاً من formData
      });

      const responseData = await response.json();
      console.log(responseData);
      console.log(formData);

      if (response.ok) {
        showToast(language === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Order submitted successfully');
      } else {
        showToast(responseData.message || 'تعذر إرسال الطلب.');
      }
    } catch (networkError) {
      console.error('Network Error:', networkError);
      showToast('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleCouponButton = async () => {
    if (!formData.coupon_discount) {
      showToast('يرجى إدخال رمز القسيمة.');
      return;
    }

    try {
      const response = await fetch('https://demo.leetag.com/api/coupon/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          APP_KEY: api_key,
        },
        body: JSON.stringify({
          code: formData.coupon_discount,
          total_cart: baseTotal,
        }),
      });

      const responseData = await response.json();

      if (responseData.status) {
        const discount = responseData.data.coupon.precentage;
        setAppliedDiscount(discount);
        showToast('تم تطبيق القسيمة بنجاح!');
      } else {
        setFormData(prev => ({
        ...prev,
        coupon_discount: '', // مسح الكوبون إذا كان خاطئًا
      }));
      showToast(responseData.message || "تعذر تطبيق القسيمة.");
      }
    } catch (error) {
      console.error('Network Error:', error);
      showToast('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    }
  };

const handlePointsButton = async () => {
    if (!formData.total) {
      showToast('يرجى التأكد من إجمالي السلة.');
      return;
    }

    try {
      const response = await fetch('https://demo.leetag.com/api/customer/points/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
          APP_KEY: api_key,
        },
        body: JSON.stringify({
          total_cart: updatedTotal, 
        }),
      });

      const responseData = await response.json();

      if (parseFloat(responseData.data.points) === 0) {
        showToast('ليس لديك نقاط كافية لاستخدامها.');
        return;
      }

      if (responseData.status) {
        const discountedTotal = (parseFloat(updatedTotal) - parseFloat(responseData.data.points_price)).toFixed(2);
        setUpdatedTotal(discountedTotal);
        setPayPoint(discountedTotal);
        setFormData((prev) => ({ ...prev, pay_point: 1 })); 
        showToast('تم تطبيق النقاط بنجاح!');
      } else {
        showToast(responseData.message || 'تعذر تطبيق النقاط.');
      }
    } catch (networkError) {
      console.error('Network Error:', networkError);
      showToast('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    }
  };

const handleCancelPoints = () => {
    setUpdatedTotal(totalBeforeDiscount); 
    setPayPoint(null)
    setFormData((prev) => {
      const { pay_point, ...updatedForm } = prev; 
      return updatedForm;
    });
    showToast('تم إلغاء استخدام النقاط.');
};


  return (
    <div>
      <Outlet
        context={{
          updateData,
          handleReviewSubmit,
          handleCouponButton,
          handlePointsButton,
          handleCancelPoints,
          formData,
          required,
          updatedTotal,
          appliedDiscount,
          totalBeforeDiscount,
          payPoint,
          shippingPrice
        }}
      />
    </div>
  );
}