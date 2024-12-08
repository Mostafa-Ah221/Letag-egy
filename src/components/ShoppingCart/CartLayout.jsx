import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavCart from './NavCart';
import { useCart } from '../../context/CartContext'; // استدعاء useCart للوصول إلى cart

export default function CartLayout() {
  const { cart, getTotalPrice } = useCart(); 
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedTotal = getTotalPrice().toFixed(2);
    setTotal(calculatedTotal);
    // تحديث formData بقيمة total عند التغيير
    setFormData(prev => ({
      ...prev,
      total: calculatedTotal
    }));
  }, [getTotalPrice, cart]); // عند تغير cart أو getTotalPrice

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
    shipping_company_id: '',
    address_id: '',
    building_number: '',
    floor_number: '',
  });

  // تحديث product_data في formData عندما يتغير الـ cart
  useEffect(() => {
    const products = cart.map(item => ({
      id: item.id,
      name: item.title, 
      price: item.price, 
      quantity: item.quantity
    }));

    setFormData(prev => ({
      ...prev,
      product_data: products, 
    }));
    console.log("Updated product_data:", products);
  }, [cart]); 

  const updateData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  // دالة للتحقق من الحقول المطلوبة
  const validateFields = () => {
    const requiredFields = ['first_name', 'email', 'phone', 'delivery_address','payment_method','address_id']; // حدد الحقول المطلوبة
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`حقل ${field} مطلوب.`);
        return false; 
      }
    }
    return true; 
  };

  const handleReviewSubmit = async () => {
    if (!validateFields()) {
      return; // التوقف عن المتابعة إذا كان هناك حقل فارغ
    }

    try {
      const response = await fetch('https://demo.leetag.com/api/order/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('تم إرسال الطلب بنجاح');
      } else {
        console.error('حدث خطأ أثناء إرسال الطلب');
      }
    } catch (error) {
      console.error('خطأ في الشبكة:', error);
    }
  };

  return (
    <div>
      <NavCart />
      <Outlet context={{ updateData, handleReviewSubmit }} />
    </div>
  );
}
