import { useOutletContext } from 'react-router-dom';

export default function Address() {
  const { updateData } = useOutletContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">العنوان</h2>
      <input className="input-field" type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
      <input className="input-field" type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
      <input className="input-field" type="text" name="phone" placeholder="Phone" onChange={handleChange} />
      <input className="input-field" type="text" name="email" placeholder="Email" onChange={handleChange} />
    </div>
  );
}
