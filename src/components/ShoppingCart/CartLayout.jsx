import { useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import NavCart from './NavCart';
import { useCart } from '../../context/CartContext'; 
import { ContextData } from '../../context/ContextApis';

export default function CartLayout() {
  const { cart, getTotalPrice } = useCart(); 
    const { userToken,userData} = useContext(ContextData);
  
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedTotal = getTotalPrice().toFixed(2);
    setTotal(calculatedTotal);
   
    setFormData(prev => ({
      ...prev,
      total: calculatedTotal
    }));
  }, [getTotalPrice, cart]); 
// عند تحميل بيانات المستخدم، حدث formData
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
  }, [cart]);

  const updateData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const validateFields = () => {
    const requiredFields = ['first_name','last_name', 'email', 'phone', 'delivery_address'];
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
    return; 
  }

  console.log("Data to be sent:", formData);

  try {
    const response = await fetch('https://demo.leetag.com/api/order/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,
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
      <Outlet context={{ updateData, handleReviewSubmit,formData }} />
    </div>
  );
}
