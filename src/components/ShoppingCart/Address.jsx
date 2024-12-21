import { useOutletContext } from "react-router-dom";
// import AddAddress from "../AddAddress/AddAddress";
import { ContextData } from "../../context/ContextApis";
import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { HiPlusSm } from "react-icons/hi";
import CartOrder from "./CartOrder";

export default function Address() {
  const { updateData, handleReviewSubmit, formData ,handleCoponeButton,handlePointsButton,required} = useOutletContext();
  const { userData, getAddressList, userToken, settings_domain } = useContext(ContextData);
  const { language } = useLanguage();

  // const [openAddress, setOpenAddress] = useState(false);
  const [selectedTownId, setSelectedTownId] = useState('');
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [shiping, setShiping] = useState('');
const [openSection, setOpenSection] = useState(null);

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


  // تحديث بيانات المستخدم
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

  // جلب قائمة العناوين
  const { data: addressList, isLoading, isError } = useQuery({
    queryKey: ["getAddressList", language],
    queryFn: () => getAddressList(userToken),
  });

  return (
    <>
          <h1 className="text-primary text-center text-3xl pt-3 pb-1 font-semibold">{language === "ar" ? "الدفع" : "Checkout"}</h1>
        <div className="grid grid-cols-12 gap-4">
      {/* عمود البيانات */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
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

        {/* إدخال العناوين */}
        <div className="px-4 bg-white rounded">
          <select
            name="town"
            className={`w-full mt-2 input-field text-gray-400 ${
             !formData.town ? 'text-gray-400' : 'text-black'}`}
            onChange={handleTownChange}
          >
            <option value="" disabled selected >
              {language === "ar" ? "اختر المحافظة" : "Select Town"}
            </option>
            {towns.map((town) => (
              <option key={town.id} value={town.id}>
                {town.name}
              </option>
            ))}
          </select>
          <select
            name="region"
            className={`w-full mt-2 input-field text-gray-400 ${
             !formData.town ? 'text-gray-400' : 'text-black'}`}
            onChange={handleRegionChange}
          >
            <option value="" disabled selected>
              {language === "ar" ? "اختر المنطقة" : "Select Region"}
            </option>
            {regions.map((region) => (
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
          <textarea
            name="comment"
            rows={5}
            placeholder={language === "ar" ? "ملاجظات علي الطلب" : "Comment"}
            className="input-field w-full mt-2"
            onChange={handleChange}
          />
        </div>

        {/* تعليق وكود خصم */}
        {/* <div className="bg-white px-4 py-4 rounded">
{/*          
          <input
            name="coupon_discount"
            placeholder={language === "ar" ? "كود الخصم" : "Coupon Code"}
            className="input-field w-full mb-2"
            onChange={handleChange}
          /> */}
          
        {/* </div> */} 
      </div>

      {/* عمود ملخص الطلب */}
      <div className="col-span-12 lg:col-span-4">
        <CartOrder />
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
              <p className="my-2">
                {language === "ar" ? (
                  <>
                    هل لديك كوبون خصم ؟ 
                    <span
                      onClick={() => setOpenSection(openSection === "coupon" ? null : "coupon")}
                      className="text-primary cursor-pointer"> اضغط هنا للإضافة 
                    </span>
                  </>
                ) : (
                  <>
                     Do you have a coupon code? 
                    <span
                      onClick={() => setOpenSection(openSection === "coupon" ? null : "coupon")}
                      className="text-primary cursor-pointer">
                       Click here to apply 
                    </span>
                  </>
                )}
              </p>

              <div>
                  <p className="my-2">
                    {language === "ar"
                      ? "الدفع بالنقاط"
                      : " Pay with points "}
                    <span
                      onClick={() => setOpenSection(openSection === "points" ? null : "points")}
                      className="text-primary cursor-pointer">
                      {language === "ar"? "إضغط هنا": " Click here "}
                    </span>
                  </p>

                  <div
                    className={`items-center justify-start ${
                      openSection === "points" ? "flex" : "hidden"}`}
                  >
                    <button
                      onClick={handlePointsButton}
                      className="border p-2 bg-primary text-white" >
                      {language === "ar"  ? "الدفع بالنقاط": "Pay with points"}
                    </button>
                  </div>
                </div>
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
    </>
  
  );
}
