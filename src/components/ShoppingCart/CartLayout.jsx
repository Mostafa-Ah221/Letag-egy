import { useState, useEffect, useContext, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ContextData } from '../../context/ContextApis';
import toast from 'react-hot-toast';

export default function CartLayout() {
  const { cart, getTotalPrice } = useCart();
  const { userToken, userData, settings_domain } = useContext(ContextData);
  const tax = settings_domain?.data.tax;
  console.log(tax);

  const showToast = (message, type = 'success') => {
  const getCSSVariable = (variableName) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};
  const primaryColor = getCSSVariable('--primary-color');

  toast[type](message, {
    iconTheme: {
      primary: primaryColor, 
      secondary: 'white', 
    },
    style: {
      borderRadius: '8px',
      background: '#fff',
      color: '#333',
      padding: '16px',
    },
  });
};
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
    total: '',
    product_data: [],
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
      }));
    }
  }, [userData]);

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
           newErrors[field] = `حقل ${field} مطلوب.`; // حفظ رسالة الخطأ لكل حقل ناقص
      }
    }
    setRequired(newErrors); // تحديث حالة الأخطاء
  return Object.keys(newErrors).length === 0; 
  };

  const handleReviewSubmit = async () => {
    if (!validateFields()) return;

    // حساب الضريبة بناءً على tax القادم من settings_domain
    const taxPercentage = parseFloat(tax || 0);
    const totalWithTax = (parseFloat(formData.total) * (1 + taxPercentage / 100)).toFixed(2);

    // جمع total مع shipping_price
    const updatedTotal = (parseFloat(totalWithTax) + parseFloat(formData.shipping_price || 0)).toFixed(2);

    // تحديث قيمة total في formData
    const updatedFormData = { ...formData, total: updatedTotal };

    console.log('FormData to send:', JSON.stringify(updatedFormData, null, 2));

    try {
      const response = await fetch('https://tarshulah.com/api/order/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
        },
        body: JSON.stringify(updatedFormData),
      });

      const responseData = await response.json();

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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formData.coupon_discount,
          total_cart: formData.total,
        }),
      });

      const responseData = await response.json();

      if (responseData.status) {
        const discountedTotal = (parseFloat(formData.total) - parseFloat(responseData.data.coupon)).toFixed(2);
        setFormData((prev) => ({
          ...prev,
          total: discountedTotal,
        }));
        showToast('تم تطبيق القسيمة بنجاح!');
      } else {
        alert(responseData.message || 'تعذر تطبيق القسيمة.');
      }
    } catch (networkError) {
      console.error('Network Error:', networkError);
      alert('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    }
  };
const handlePointsButton = async () => {
  if (!formData.total) {
    showToast("يرجى التأكد من إجمالي السلة.");
    return;
  }

  try {
    const response = await fetch("https://tarshulah.com/api/customer/points/apply", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
      body: JSON.stringify({
        total_cart: formData.total,
      }),
    });

    const responseData = await response.json();

    // تحقق إذا كانت النقاط تساوي صفر
    if (parseFloat(responseData.data.points) === 0) {
      showToast('ليس لديك نقاط كافية لاستخدامها.');
      return;
    }

    if (responseData.status) {
      const discountedTotal = (parseFloat(formData.total) - parseFloat(responseData.data.points_price)).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        total: discountedTotal,
      }));
      showToast('تم تطبيق النقاط بنجاح!');
    } else {
      showToast(responseData.message || 'تعذر تطبيق النقاط.');
    }
  } catch (networkError) {
    console.error('Network Error:', networkError);
    alert('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
  }
};


  return (
    <div>
      <Outlet context={{ updateData, handleReviewSubmit, handleCouponButton, handlePointsButton, formData,required }} />
    </div>
  );
}
