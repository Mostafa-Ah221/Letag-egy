import { useOutletContext } from 'react-router-dom';
import { useContext } from 'react';
import { ContextData } from '../../context/ContextApis';

export default function PayPage() {
  const { updateData, handleReviewSubmit } = useOutletContext();
  const { settings_domain } = useContext(ContextData);
// console.log(settings_domain?.data.getways);


 

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">الدفع</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input-field w-full p-2 border rounded" type="text" name="shipping_id" placeholder="shipping_id" onChange={handleChange} />
        <input className="input-field w-full p-2 border rounded" type="text" name="shipping_price" placeholder="shipping_price" onChange={handleChange} />

        <select className="input-field w-full p-2 border rounded" onChange={handleChange} >
          <option value="">حدد منطقة </option>
          {settings_domain?.data.locations.map((getway) => (
            <option key={getway.id} value={getway.id}>{getway.name}</option>
          ))}
        </select>
        
        {/* <input className="input-field w-full p-2 border rounded" type="text" name="payment_method" placeholder="Payment Method" onChange={handleChange} /> */}
        <select className="input-field w-full p-2 border rounded" onChange={handleChange} >
          <option value="">اختر نظام الدفع</option>
          {settings_domain?.data.getways.map((getway) => (
            <option key={getway.id} value={getway.id}>{getway.name}</option>
          ))}
        </select>
        {/* هنا استخدمنا القيمة المحسوبة للـ total */}
      

        <input className="input-field w-full p-2 border rounded" type="text" name="coupon_discount" placeholder="coupon_discount" onChange={handleChange} />
        <input className="input-field w-full p-2 border rounded" type="text" name="shipping_company_id" placeholder="shipping_company_id" onChange={handleChange} />

        <input className="input-field w-full p-2 border rounded" type="text" name="address_id" placeholder="address_id" onChange={handleChange} />
        
      </div>
        <div>
          <button className="bg-primary text-white p-2" onClick={handleReviewSubmit}>إرسال الطلب</button>
        </div>
    </div>
  );
}
