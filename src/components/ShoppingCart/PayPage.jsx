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
       

        <select className="input-field w-full p-2 border rounded" onChange={handleChange} >
          <option value="">حدد منطقة</option>
          {settings_domain?.data.locations.map((getway) => (
            <option key={getway.id} value={getway.id}>{getway.name}</option>
          ))}
        </select>
        
        {/* تعديل هنا من select إلى radio */}
        <div className="w-full p-2 border rounded">
          <h3 className="font-semibold mb-2">اختر نظام الدفع</h3>
          {settings_domain?.data.getways.map((getway) => (
            <div key={getway.id} className="flex items-center mb-2">
              <input
                type="radio"
                id={`payment-${getway.id}`}
                name="payment_method"
                value={getway.id}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor={`payment-${getway.id}`} className="text-sm">{getway.name}</label>
            </div>
          ))}
        </div>

        {/* هنا استخدمنا القيمة المحسوبة للـ total */}
        <input className="input-field w-full p-2 border rounded" type="text" name="coupon_discount" placeholder="coupon_discount" onChange={handleChange} />
      </div>
              <input className="input-field" type="text" name="delivery_address" placeholder="Delivery Address" onChange={handleChange} />
      <textarea className="input-field h-28" type="text" name="comment" placeholder="comment" onChange={handleChange} />
      <div>
        <button className="bg-primary text-white p-2" onClick={handleReviewSubmit}>إرسال الطلب</button>
      </div>
    </div>
  );
}
