import { useOutletContext } from "react-router-dom";
import { ContextData } from "../../context/ContextApis";
import { useContext, useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import CartOrder from "./CartOrder";
import { HiPlusSm } from "react-icons/hi";
import AddAddress from "../AddAddress/AddAddress";

export default function DataOrder() {
  const { updateData, handleReviewSubmit, formData ,handleCouponButton,handlePointsButton,required} = useOutletContext();
  const { userData, userToken, settings_domain,addresses } = useContext(ContextData);
  const { language } = useLanguage();

  // const [openAddress, setOpenAddress] = useState(false);
  const [selectedTownId, setSelectedTownId] = useState('');
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [shiping, setShiping] = useState('');
const [openSection, setOpenSection] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const towns = settings_domain?.data?.locations || [];

  const handleTownChange = (event) => {
    const townId = event.target.value;
    setSelectedTownId(townId);
    const selectedTown = towns.find(town => String(town.id) === townId);
    setRegions(selectedTown?.regions || []);
    setSelectedRegionId('');
  };

  // معالجة تغيير المنطقة
 // معالجة تغيير المنطقة
const handleRegionChange = (event) => {
  const regionId = event.target.value;
  setSelectedRegionId(regionId);

  // البحث عن الشحن بناءً على الـ regionId
  const selectedRegion = regions.find(region => String(region.id) === regionId);

  // تعيين قيمة shipping_price
  setShiping(selectedRegion?.shipping_price || 0);
};

  useEffect(() => {
    if (userData) {
      const updatedData = {
        first_name: userData.name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
       phone: userData.phone || "",
      };
       
      if (
        formData.first_name !== updatedData.first_name ||
        formData.last_name !== updatedData.last_name ||
        formData.email !== updatedData.email,
        formData.phone !== updatedData.phone
      ) {
        updateData(updatedData);
      }
    }

  }, [userData, formData, updateData]);
useEffect(() => {
  updateData({
    location_id: selectedTownId,
    shipping_id: selectedRegionId,
    shipping_price: shiping,
  });
}, [selectedTownId, selectedRegionId, shiping]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleAddressSelection = (addressId) => {
  const selectedAddress = addresses.find(address => address.id === addressId);
  updateData({
    location_id: selectedAddress.location_id,
    shipping_id: selectedAddress.region_id,
    delivery_address: selectedAddress.address,
    building_number: selectedAddress.building_number,
    floor_number: selectedAddress.floor_number,
    shipping_price: selectedAddress.shipping_price,
    address_id: addressId,
  });
};



  return (
    <div >
          <h1 className="text-primary text-center text-3xl pt-3 pb-1 font-semibold mb-5">{language === "ar" ? "الدفع" : "Checkout"}</h1>
        <div className={`grid grid-cols-12 gap-4 m-0 ${language === "ar" ?"ml-3":"mr-3"}`}>
      {/* عمود البيانات */}
      <div className={`col-span-12 lg:col-span-7 flex  flex-col gap-4 ${language === 'ar'? "mr-14":"ml-14"}`}>
        {/* تفاصيل الطلب */}
        <div className="bg-white rounded px-4">
          <h2 className="text-xl font-semibold my-5">
            {language === "ar" ? "تفاصيل الطلب" : "Order Details"}
          </h2>
          <input
            value={formData.first_name}
            name="first_name"
            placeholder={language === "ar" ? "الاسم الأول" : "First Name"}
            className="input-field w-full mt-2"
            onChange={handleChange}
          />
            {required.first_name && <span className="text-red-500">{required.first_name}</span>}
          <input
            value={formData.last_name}
            name="last_name"
            placeholder={language === "ar" ? "الاسم الأخير" : "Last Name"}
            className="input-field w-full mt-2"
            onChange={handleChange}
          />
           {required.last_name && <span className="text-red-500">{required.last_name}</span>}
          <input
            value={formData.phone}
            name="phone"
            placeholder={language === "ar" ? "الهاتف" : "Phone"}
            className="input-field w-full mt-2"
            onChange={handleChange}
          />
          {required.phone && <span className="text-red-500">{required.phone}</span>}
          <input
            value={formData.email}
            name="email"
            placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
            className="input-field w-full mt-2"
            onChange={handleChange}
          />
          {required.email && <span className="text-red-500">{required.email}</span>}
        </div>
      {userToken ? (
        <div className="bg-white p-4 rounded-md">
          <div className=" mb-3">
            <h2>{language === "ar"?"يُرجى اختيار أو إضافة عنوان التوصيل لهذه الطلبيه" :"Please choose or add a delivery address for this order"} </h2>
          </div>
        <div className="flex justify-end items-center mb-3">
        <button
          onClick={() => setShowModal(!showModal)}
          className="text-primary hover:text-slate-700 font-bold duration-200"
        >
          <HiPlusSm className="inline-block text-3xl" />
          {language === "ar" ? "اضف عنوان جديد لأستلام طلباتك" : "Add a new address to receive your orders"}
        </button>
      </div>

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setShowModal(false)} // هنا يجب أن تكون دالة
          >
            <div className="bg-white w-[40%] flex justify-center items-center pb-5 relative" 
            onClick={(e) => e.stopPropagation()}>
              <AddAddress showAddress={false}/>
               <button
               onClick={() => setShowModal(false)}
              className={`absolute -top-3 ${language === 'ar' ? '-left-2' : 'right-2'} text-xl font-bold text-white bg-primary rounded-full w-8 h-8`} >
               ✕
              </button>
            </div>
          </div>
        </>
      )}
    <table className="table-auto w-full border-collapse border border-gray-300">
      {/* Header Row */}
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-center">
            {language === 'ar' ? "اختيار" : "Select"}
          </th>
          <th className="border border-gray-300 px-4 py-2 text-center">
            {language === 'ar' ? "المحافظة" : "Governorate"}
          </th>
          <th className="border border-gray-300 px-4 py-2 text-center">
            {language === 'ar' ? "المنطقة" : "Region"}
          </th>
          <th className="border border-gray-300 px-4 py-2 text-center">
            {language === 'ar' ? "تفاصيل العنوان" : "Address Details"}
          </th>
          <th className="border border-gray-300 px-4 py-2 text-center">
            {language === 'ar' ? "رقم المبنى" : "Building Number"}
          </th>
          <th className="border border-gray-300 px-4 py-2 text-center">
            {language === 'ar' ? "رقم الطابق" : "Floor Number"}
          </th>
        </tr>
      </thead>


      {/* Address Rows */}
      <tbody>
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <tr key={address.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input
                  className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:bg-primary checked:border-gray-300 "
                  type="radio"
                  name="selectedAddress"
                  value={address.id}
                  onChange={() => handleAddressSelection(address.id)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {address.location_name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {address.region_name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {address.address}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {address.building_number}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {address.floor_number}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4">
              {language === "ar" ? "لا توجد عناوين متاحة" : "No addresses available"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
) : (
  <div className="px-4 bg-white rounded">
    <select
      name="town"
      className={`w-full mt-2 input-field text-gray-400 ${
        !formData.town ? "text-gray-400" : "text-black"
      }`}
      onChange={handleTownChange}
    >
      <option value="" disabled selected>
        {language === "ar" ? "اختر المحافظة" : "Select Town"}
      </option>
      {towns?.map((town) => (
        <option key={town.id} value={town.id}>
          {town.name}
        </option>
      ))}
    </select>
    <select
      name="region"
      className={`w-full mt-2 input-field text-gray-400 ${
        !formData.region ? "text-gray-400" : "text-black"
      }`}
      onChange={handleRegionChange}
    >
      <option value="" disabled selected>
        {language === "ar" ? "اختر المنطقة" : "Select Region"}
      </option>
      {regions?.map((region) => (
        <option key={region.id} value={region.id}>
          {region.name}
        </option>
      ))}
    </select>
    <input
      name="delivery_address"
      placeholder={language === "ar" ? "عنوان التوصيل" : "Delivery Address"}
      className="input-field w-full mt-2"
      onChange={handleChange}
    />
    {required.delivery_address && <span className="text-red-500">{required.delivery_address}</span>}
    <input
      name="building_number"
      placeholder={language === "ar" ? "رقم المبنى" : "Building Number"}
      className="w-full mt-2 input-field"
      onChange={handleChange}
    />
    <input
      name="floor_number"
      placeholder={language === "ar" ? "رقم الطابق" : "Floor Number"}
      className="w-full mt-2 input-field"
      onChange={handleChange}
    />
  </div>
)}


        {/* إدخال العناوين */}
       
        <div className="px-4 bg-white rounded"> 
          <textarea
            name="comment"
            rows={5}
            placeholder={language === "ar" ? "ملاجظات علي الطلب" : "Comment"}
            className="input-field w-full mt-2"
            onChange={handleChange}
          />
          </div>
      </div>

      {/* عمود ملخص الطلب */}
      <div className="col-span-12 lg:col-span-4 mx-4">
        <CartOrder/>
        <div className="px-4 py-4 bg-white rounded">
          <h3 className="font-semibold mb-2">{language === "ar" ? "نظام الدفع" : "Payment Method"}</h3>
          {settings_domain?.data?.getways.map((getway) => (
            <div key={getway.id} className="flex items-center my-2">
              <input
                type="radio"
                id={`payment-${getway.id}`}
                name="payment_method"
                value={getway.payment_method}
                onChange={handleChange}
                />
              <label htmlFor={`payment-${getway.id}`} className="ml-2">
                {getway.name}
              </label>
            </div>
          ))}
          {required.payment_method && <span className="text-red-500 block">{required.payment_method}</span>} 
          <div>
          <div>
  {/* كود الخصم */}
  {/* كود الخصم */}
<p className="my-2">
  {language === "ar" ? (
    <>
      هل لديك كوبون خصم؟
      <span
        onClick={() => setOpenSection(openSection === "coupon" ? null : "coupon")}
        className="text-primary cursor-pointer"
      >
        اضغط هنا للإضافة
      </span>
    </>
  ) : (
    <>
      Do you have a coupon code?
      <span
        onClick={() => setOpenSection(openSection === "coupon" ? null : "coupon")}
        className="text-primary cursor-pointer"
      >
        Click here to apply
      </span>
    </>
  )}
</p>
{openSection === "coupon" && (
  <div className="flex items-center gap-2 mt-2">
    <input
      className="border p-2 flex-1"
      type="text"
      name="coupon_discount"
      // value={formData.coupon_discount || ""}
      onChange={(e) => updateData({ coupon_discount: e.target.value })}
      placeholder={language === "ar" ? "أدخل الكوبون" : "Enter coupon"}
    />
    <button
      className="border p-2 bg-primary text-white"
      onClick={handleCouponButton}
    >
      {language === "ar" ? "ارسال" : "Apply"}
    </button>
  </div>
)}



  {/* الدفع بالنقاط */}
  <p className="my-2">
    {language === "ar" ? "الدفع بالنقاط" : "Pay with points"}
    <span
      onClick={() => setOpenSection(openSection === "points" ? null : "points")}
      className="text-primary cursor-pointer"
    >
      {language === "ar" ? " إضغط هنا " : "Click here"}
    </span>
  </p>
  {openSection === "points" && (
    <div className="items-center justify-start flex">
      <button
        onClick={handlePointsButton}
        className="border p-2 bg-primary text-white"
      >
        {language === "ar" ? "الدفع بالنقاط" : "Pay with points"}
      </button>
    </div>
  )}
</div>

          
          </div>
        </div>

        <button
          className="bg-primary text-white p-2 rounded-md w-full mt-4"
          onClick={handleReviewSubmit}
        >
          {language === "ar" ? "إرسال الطلب" : "Submit Order"}
        </button>
      </div>
    </div>
    </div>
  );
}
