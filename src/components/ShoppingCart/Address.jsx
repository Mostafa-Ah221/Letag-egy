import { useOutletContext } from "react-router-dom";
import AddAddress from "../AddAddress/AddAddress";
import { ContextData } from "../../context/ContextApis";
import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { HiPlusSm } from "react-icons/hi";

export default function Address({ price }) {
  const { updateData, handleReviewSubmit } = useOutletContext();
  const { userData, getAddressList, userToken, settings_domain } = useContext(ContextData);
  const { language } = useLanguage();

  // State لإدارة العنوان المختار وإضافة عنوان جديد
  const [openAddress, setOpenAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // بيانات الفورم
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    delivery_address: "",
    comment: "",
    address_id: "",
    region_id: "",
    payment_method: "",
    coupon_discount: "",
  });

  // تحديث بيانات الفورم ببيانات المستخدم عند التحميل
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        first_name: userData.name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      }));
      updateData({
        first_name: userData.name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
  }, [userData, updateData]);

  // تحديث الحقول عند تغيير المدخلات
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    updateData({ [name]: value }); // تحديث البيانات المشتركة
  };

  // تحديد العنوان من القائمة
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    const addressData = {
      address_id: address.id,
      delivery_address: `${address.location_name}, ${address.region_name}`,
      building_number: address.building_number,
      floor_number: address.floor_number,
    };
    setFormData((prev) => ({ ...prev, ...addressData }));
    updateData(addressData);
  };

  // جلب قائمة العناوين
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAddressList", language],
    queryFn: () => getAddressList(userToken),
  });

  return (
    <div className="flex flex-col gap-4">
      {/* بيانات المستخدم */}
      <div className="w-1/2 bg-white rounded p-4">
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
          value={formData.phone}
          className="input-field w-full mb-2"
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />
        <input
          value={formData.email}
          className="input-field w-full mb-2"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
      </div>

      {/* قائمة العناوين */}
      {userToken !== null ?  data?.data.addresses.map((address) => (
          <div key={address.id} className="w-full p-2 bg-white flex gap-2 mb-2">
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
        ))
      : ""
      // <div className='container '>
      //             {/* اختيار المحافظة */}
      //             <h3 className='text-start font-bold text-2xl'>
      //                 {language === 'ar' ? 'يرجى اختيار المحافظة' : 'Please select the city'}
      //             </h3>
      //             <div className='w-[70%]'>
      //                 <select
      //                     name='town'
      //                     className='w-full h-10 border border-gray-400 outline-none'
      //                     value={selectedTownId}
      //                     onChange={handleTownChange}
      //                 >
      //                     <option value="" disabled>
      //                         {language === 'ar' ? 'اختر المحافظة' : 'Select city'}
      //                     </option>
      //                     {towns.map((town) => (
      //                         <option key={town.id} value={town.id}>
      //                             {town.name}
      //                         </option>
      //                     ))}
      //                 </select>
      
      //                 {/* اختيار المنطقة */}
      //                 <h3 className='text-start font-bold text-2xl mt-4'>
      //                     {language === 'ar' ? 'يرجى اختيار المنطقة' : 'Please select the region'}
      //                 </h3>
      //                 <select
      //                     name='region'
      //                     className='w-full h-10 border border-gray-400 outline-none'
      //                     value={selectedRegionId}
      //                      onChange={handleChange}
      //                     disabled={!regions.length}
      //                 >
      //                     <option value="" disabled>
      //                         {language === 'ar' ? 'اختر المنطقة' : 'Select region'}
      //                     </option>
      //                     {regions.map((region) => (
      //                         <option key={region.id} value={region.id}>
      //                             {region.name}
      //                         </option>
      //                     ))}
      //                 </select>
      
      //                 {/* Building Number */}
      //                 <h3 className='text-start font-bold text-2xl my-2'>
      //                     {language === 'ar' ? 'رقم المبنى' : 'Building number'}
      //                 </h3>
      //                 <input
      //                     placeholder={language === "ar" ? "من فضلك ادخل رقم المبنى" : "Please Enter Building Number"}
      //                     className='w-full h-10 border border-gray-400'
      //                    onChange={handleChange}

      //                 />
      
      //                 {/* Floor Number */}
      //                 <h3 className='text-start font-bold text-2xl my-2'>
      //                     {language === 'ar' ? 'رقم الطابق' : 'Floor number'}
      //                 </h3>
      //                 <input
      //                     placeholder={language === "ar" ? "من فضلك ادخل رقم الطابق" : "Please Enter Floor Number"}
      //                     className='w-full h-10 border border-gray-400'
      //                     onChange={handleChange}
      //                 />
      //             </div>
      
                 
      //         </div> 
              }
     

      {/* إضافة عنوان جديد */}
     {
             userToken !== null ? (
              <>
                <button
                  onClick={() => setOpenAddress(!openAddress)}
                  className="bg-primary text-white p-2 w-fit"
                >
                  {language === "ar" ? "اضف عنوان جديد" : "Add a new address"}
                  <HiPlusSm className="inline-block text-xl" />
                </button>

                {openAddress && (
                  <div className="w-1/2 p-4">
                    <AddAddress showAddress={false} />
                  </div>
                )}
              </>
            ) : (
              ""
            )
          }


      {/* اختيار نظام الدفع */}
      <div className="px-4 bg-white w-1/2 ">
        <input className="input-field" type="text" name="delivery_address" placeholder="Delivery Address" onChange={handleChange} />
        <h3 className="font-semibold mb-2">نظام الدفع</h3>
        {settings_domain?.data.getways.map((getway) => (
          <div key={getway.id} className="flex items-center mb-2">
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

      {/* إدخال كوبون وتعليق */}
      <div className="p-4 bg-white w-1/2">
        <input
          className="input-field w-full p-2 border rounded mb-2"
          type="text"
          name="coupon_discount"
          placeholder="Coupon Discount"
          onChange={handleChange}
        />
        <textarea
          className="input-field w-full p-2 border rounded mb-2"
          name="comment"
          placeholder="Comment"
          onChange={handleChange}
        ></textarea>
        <button className="bg-primary text-white p-2" onClick={handleReviewSubmit}>
          إرسال الطلب
        </button>
      </div>
    </div>
  );
}
