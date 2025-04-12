import { useState, useEffect, useContext, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ContextData } from '../../context/ContextApis';
import { useLanguage } from '../../context/LanguageContextPro';
import { useNavigate } from 'react-router-dom';

export default function CartLayout() {
  const { cart, getTotalPrice, showToast,clearCart } = useCart();
  const { userToken, userData, settings_domain, api_key } = useContext(ContextData);
  const { language } = useLanguage();

  const tax = settings_domain?.data.tax;
  console.log(tax);
  
const navigate = useNavigate();

  const [updatedTotal, setUpdatedTotal] = useState(getTotalPrice);
  const [baseTotal, setBaseTotal] = useState(getTotalPrice);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [totalWShiping, setTotalWShiping] = useState(0);
  const [payPoint, setPayPoint] = useState(null);
  const [payMethod, setPayMethod] = useState(null);

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
console.log(payMethod);

  useEffect(() => {
    setBaseTotal(totalPrice);
    setFormData((prev) => ({ ...prev, total: totalPrice }));
  }, [totalPrice]);

  // Memoize product data
  const products = useMemo(
    () =>
      cart.map((item) => ({
        product_id: item.id,
         price: item.special_price > 0 ? item.special_price : item.price, 
        quantity: item.quantity,
      })),
    [cart]
  );
console.log(updatedTotal);

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
  // تحديث طريقة حساب السعر النهائيs
  useEffect(() => {
   const calculateTotal = () => {
      const taxPercentage = parseFloat(tax || 0); // tax = 0.14
      const totalWithTax = parseFloat(baseTotal) * (1 + taxPercentage); // بدون القسمة على 100
      
      const shippingPrice = parseFloat(formData.shipping_price || 0);
      
      const totalWithShipping = totalWithTax + shippingPrice;
      const totalAfterTaxWithShipping = parseFloat(baseTotal) + shippingPrice;
      setTotalWShiping(totalAfterTaxWithShipping)

      setTotalBeforeDiscount(totalWithShipping.toFixed(3));

      const finalTotal = (totalWithShipping * (1 - appliedDiscount / 100)).toFixed(3);
      return finalTotal;
};


    const newTotal = calculateTotal();
    setUpdatedTotal(newTotal);
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
      total: baseTotal, 
    };

    console.log('Final data being sent:', finalData);

    try {
     const url = payMethod === "الدفع عند الاستلام" 
            ? "https://tarshulah.com/api/order/save" 
            : "https://tarshulah.com/api/web/order/save";

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: userToken,
              APP_KEY: api_key,
            },
            body: JSON.stringify(finalData),
          });


      const responseData = await response.json();
      console.log(responseData);
      console.log(formData);

      if (response.ok) {
        showToast(language === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Order submitted successfully');
         if (responseData.invoiceURL) {
        window.open(responseData.invoiceURL, '_blank');
    }
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
    const response = await fetch('https://tarshulah.com/api/coupon/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        APP_KEY: api_key,
      },
      body: JSON.stringify({
        code: formData.coupon_discount, 
        total_cart: totalWShiping,
      }),
    });

    const responseData = await response.json();

    if (responseData.status) {
      const discount = responseData.data.coupon.precentage; // استخراج نسبة الخصم
      setAppliedDiscount(discount); // حفظ نسبة الخصم

      // تحديث البيانات لتضمين نسبة الخصم
      setFormData(prev => ({
        ...prev,
        coupon_discount: discount, // حفظ نسبة الخصم داخل الفورم
      }));

      showToast('تم تطبيق القسيمة بنجاح!');
    } else {
      setFormData(prev => ({
        ...prev,
        coupon_discount: '', // مسح الكوبون إذا كان خاطئًا
      }));
      showToast(responseData.message || 'تعذر تطبيق القسيمة.');
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
      const response = await fetch('https://tarshulah.com/api/customer/points/apply', {
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
        showToast(language === "ar" ? "ليس لديك نقاط كافية لاستخدامها." : "You don't have enough points to use.");
        return;
      }

     if (responseData.status) {
        console.log(responseData.data.points_price);

        const pointsPrice = parseFloat(responseData.data.points_price);
        const currentTotal = parseFloat(updatedTotal);

        let discountedTotal;
        if (pointsPrice > currentTotal) {
          discountedTotal = 0;
        } else {
          discountedTotal = (currentTotal - pointsPrice).toFixed(3);
        }

        setUpdatedTotal(discountedTotal);
        setPayPoint(discountedTotal);
        setFormData((prev) => ({ ...prev, pay_point: 1 }));

        showToast(language === "ar" ? "تم تطبيق النقاط بنجاح!" : "Points applied successfully!");
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
    showToast(language === "ar" ? "تم إلغاء استخدام النقاط." : "Points usage has been canceled.");
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
          shippingPrice,
          setPayMethod
        }}
      />
    </div>
  );
}