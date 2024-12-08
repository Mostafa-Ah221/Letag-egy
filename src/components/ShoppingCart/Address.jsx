import { useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ContextData } from '../../context/ContextApis';

export default function Address() {
  const { updateData } = useOutletContext();
  const { userData } = useContext(ContextData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">العنوان</h2>
      {/* First Name */}
      <input
      required
        defaultValue={userData?.name} // قيمة افتراضية
        className="input-field"
        type="text"
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
      />

      {/* Last Name */}
      <input
      required
        defaultValue={userData?.last_name }
        className="input-field"
        type="text"
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
      />

      {/* Phone */}
      <input
        className="input-field"
        type="text"
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      {/* Email */}
      <input
        defaultValue={userData?.email ?? ''}
        className="input-field"
        type="text"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
    </div>
  );
}
