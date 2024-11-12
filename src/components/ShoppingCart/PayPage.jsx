import { useOutletContext } from 'react-router-dom';

export default function PayPage() {
  const { updateData } = useOutletContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">الدفع</h2>
      <input className="input-field" type="text" name="payment_method" placeholder="Payment Method" onChange={handleChange} />
      <input className="input-field" type="text" name="total" placeholder="Total" onChange={handleChange} />
    </div>
  );
}
