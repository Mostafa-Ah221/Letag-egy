import { useOutletContext } from 'react-router-dom';

export default function Shipping() {
  const { updateData } = useOutletContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">الشحن</h2>
      <input className="input-field" type="text" name="delivery_address" placeholder="Delivery Address" onChange={handleChange} />
      <input className="input-field" type="text" name="building_number" placeholder="Building Number " onChange={handleChange} />
      <input className="input-field" type="text" name="floor_number" placeholder="Floor Number" onChange={handleChange} />
      <textarea className="input-field h-28" type="text" name="comment" placeholder="comment" onChange={handleChange} />
    </div>
  );
}
