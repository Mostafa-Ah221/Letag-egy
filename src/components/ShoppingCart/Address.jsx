import { useOutletContext } from "react-router-dom";
import AddAddress from "../AddAddress/AddAddress";
import { ContextData } from "../../context/ContextApis";
import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { HiPlusSm } from "react-icons/hi";
import CartOrder from "./CartOrder";

export default function Address() {
  const { updateData, handleReviewSubmit, formData } = useOutletContext();
  const { userData, getAddressList, userToken, settings_domain } = useContext(ContextData);
  const { language } = useLanguage();

  const [openAddress, setOpenAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

 useEffect(() => {
  if (userData) {
    const updatedData = {
      first_name: userData.name || "",
      last_name: userData.last_name || "",
      email: userData.email || "",
    };

    // تحقق من التغيير قبل التحديث
    if (
      formData.first_name !== updatedData.first_name ||
      formData.last_name !== updatedData.last_name ||
      formData.email !== updatedData.email
    ) {
      updateData(updatedData);
    }
  }
}, [userData, formData, updateData]);


  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    const addressData = {
      address_id: address.id,
      delivery_address: `${address.location_name}, ${address.region_name}`,
      building_number: address.building_number,
      floor_number: address.floor_number,
    };
    updateData(addressData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAddressList", language],
    queryFn: () => getAddressList(userToken),
  });

  return (
    <div className="grid grid-cols-12">
      <div className="flex flex-col gap-4 col-span-12 lg:col-span-7">
        {/* بيانات المستخدم */}
        <div className="bg-white rounded px-4">
          <h2 className="text-xl font-semibold mb-4">تفاصيل الطلب</h2>
          <input
            required
            value={formData.first_name}
            className="input-field w-full mb-2"
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            required
            value={formData.last_name}
            className="input-field w-full mb-2"
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
          />
          <input
            required
            value={formData.phone}
            className="input-field w-full mb-2"
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />
          <input
            required
            value={formData.email}
            className="input-field w-full mb-2"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>

        {/* قائمة العناوين */}
        {userToken &&
          data?.data.addresses.map((address) => (
            <div
              key={address.id}
              className="p-2 bg-white flex gap-2 mb-2 border rounded-md mx-4"
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddress?.id === address.id}
                onChange={() => handleAddressSelect(address)}
              />
              <div>
                <p>محافظة: {address.location_name}</p>
                <p>منطقة: {address.region_name}</p>
                <p>رقم المبنى: {address.building_number}</p>
                <p>رقم الطابق: {address.floor_number}</p>
              </div>
            </div>
          ))}

        {/* إضافة عنوان جديد */}
        {userToken && (
          <>
            <button
              onClick={() => setOpenAddress(!openAddress)}
              className="bg-primary text-white p-2 w-fit"
            >
              {language === "ar" ? "اضف عنوان جديد" : "Add a new address"}
              <HiPlusSm className="inline-block text-xl" />
            </button>

            {openAddress && (
              <div className="p-4">
                <AddAddress showAddress={false} />
              </div>
            )}
          </>
        )}

        {/* إدخال كوبون وتعليق */}
        <div className="p-4 bg-white">
          <input
            className="input-field w-full mb-2"
            type="text"
            name="delivery_address"
            placeholder="Delivery Address"
            onChange={handleChange}
          />
          <input
            className="input-field w-full mb-2"
            type="text"
            name="coupon_discount"
            placeholder="Coupon Discount"
            onChange={handleChange}
          />
          <textarea
            className="input-field w-full mb-2"
            name="comment"
            placeholder="Comment"
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* ملخص الطلب */}
      <div className="col-span-12 lg:col-span-4">
        <CartOrder />
        <div className="px-4 bg-white">
          <h3 className="font-semibold mb-2">نظام الدفع</h3>
          <hr />
          {settings_domain?.data.getways.map((getway) => (
            <div key={getway.id} className="flex items-center my-5">
              <input
                type="radio"
                id={`payment-${getway.id}`}
                name="payment_method"
                value={getway.id}
                onChange={handleChange}
              />
              <label htmlFor={`payment-${getway.id}`}>{getway.name}</label>
            </div>
          ))}
        </div>
        <button
          className="bg-primary text-white p-2 block m-auto rounded-md w-11/12"
          onClick={handleReviewSubmit}
        >
          إرسال الطلب
        </button>
      </div>
    </div>
  );
}
