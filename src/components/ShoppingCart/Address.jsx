import { useOutletContext } from "react-router-dom";
import AddAddress from "../AddAddress/AddAddress";
import { ContextData } from "../../context/ContextApis";
import { useContext } from "react";
import { useState } from "react";

export default function Address() {
  const { updateData } = useOutletContext();
  const { userData } = useContext(ContextData);
  const [openAddress, setopenAddress] =useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="flex flex-col">
      {/* الجزء الخاص بالمدخلات الأساسية */}
      <div className="w-1/2 p-4 bg-white  rounded">
        <h2 className="text-xl font-semibold mb-4">العنوان</h2>
        {/* First Name */}
        <input
          required
          defaultValue={userData?.name} // قيمة افتراضية
          className="input-field w-full mb-2"
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
        />

        {/* Last Name */}
        <input
          required
          defaultValue={userData?.last_name}
          className="input-field w-full mb-2"
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
        />

        {/* Phone */}
        <input
          className="input-field w-full mb-2"
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        {/* Email */}
        <input
          defaultValue={userData?.email ?? ''}
          className="input-field w-full "
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
              <input className="input-field" type="text" name="delivery_address" placeholder="Delivery Address" onChange={handleChange} />
      </div>
      {/* الجزء الخاص بـ AddAddress */}
      <button onClick={() => setopenAddress(!openAddress)} className="bg-primary text-white p-2 w-fit ">Add Address</button>
      <div className={`w-1/2 p-4 ${openAddress === false ? "hidden":"block"}`}>
        <AddAddress />
      </div>
    </div>
  );
}
