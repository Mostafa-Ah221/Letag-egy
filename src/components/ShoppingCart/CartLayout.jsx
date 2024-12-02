import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavCart from './NavCart';

export default function CartLayout() {
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
    product_data: '',
    coupon_discount: '',
    comment: '',
    shipping_company_id: '',
    address_id: '',
    building_number: '',
    floor_number: '',
  });
  const navigate = useNavigate();

  const updateData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch('https://demo.leetag.com/api/order/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Order submitted successfully');
        alert('success');
      } else {
        console.error('Error submitting order');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <NavCart />
      <Outlet context={{ updateData, handleReviewSubmit }} />
    </div>
  );
}
