import { useContext, useState } from "react";
import { ContextData } from "../../context/ContextApis";
import {  useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { MapPin, Building2, Layers } from "lucide-react";
import { MdCancel } from "react-icons/md";
import axios from 'axios';

export default function Address({ address = true}) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const {  userToken, deleteAddress, settings_domain,addresses } = useContext(ContextData);

  // const { data, isError, isLoading } = useQuery({
  //   queryKey: ['getAddressList', language],
  //   queryFn: () => addresses(userToken),
  // });

  const towns = settings_domain?.data?.locations || [];
  const [isShown, setIsShown] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [selectedTownId, setSelectedTownId] = useState('');
  const [selectedAddress, setSlectedAddress] = useState("");
  const [shippingPrice, setShippingPrice] = useState('');
  const [addressId, setAddressId] = useState(undefined);
  const handleDelete = async (id) => {
    try {
      await deleteAddress(id, userToken);
      queryClient.invalidateQueries(["getAddressList", language]);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };
  // Loading State

 
  // Empty State
  if (!addresses || addresses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-gray-50">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-lg text-gray-600">
            {language === 'ar' ? 'لا توجد عناوين' : 'No addresses available'}
          </span>
        </div>
      </div>
    );
  }

  const handleUpdate = (e, id) => {
    if (isShown == false) {
      setIsShown(true);
    }
    const parent = e.target.parentElement.parentElement.parentElement;
    const childrenOfparent = parent.children;
    const buildingNumber = childrenOfparent[1].children[0].children[1].textContent.split(":")[1];
    const floorNumber = childrenOfparent[1].children[1].children[1].textContent.split(":")[1];
    setBuilding(buildingNumber);
    setFloor(floorNumber);
    setSelectedBuilding(buildingNumber);
    setSelectedFloor(floorNumber);
    setAddressId(id);
  };

  const handleBuildingChange = (event) => setSelectedBuilding(event.target.value);
  const handleFloorChange = (event) => setSelectedFloor(event.target.value);

  // Handle Town Change
  const handleTownChange = (event) => {
    const townId = event.target.value;
    setSelectedTownId(townId); // تحديد المحافظة المختارة

    // استخراج المناطق من المحافظة المختارة
    const selectedTown = towns.find(town => String(town.id) === String(townId));
    setRegions(selectedTown?.regions || []);

    // إعادة تعيين المنطقة والعنوان والشحن
    setSelectedRegionId('');
    setSlectedAddress('');
    setShippingPrice('');
  };

  // Handle Region Change
  const handleRegionChange = (event) => {
    const selectedRegion = regions.find(region => String(region.id) === String(event.target.value));
    setSelectedRegionId(selectedRegion?.id || '');

    // استخراج shipping_price من المنطقة المختارة
    const price = selectedRegion?.shipping_price || '0'; // تأكد من القيمة
    setShippingPrice(price);
    console.log("Shipping Price:", price);

    // دمج اسم المنطقة مع اسم المحافظة
    const townName = towns.find(town => String(town.id) === String(selectedTownId))?.name || '';
    const regionName = selectedRegion?.name || '';
    const combinedAddress = `${regionName} - ${townName}`;
    setSlectedAddress(combinedAddress);
  };

  const handleConfirm = async (id) => {
    console.log(id);
    console.log(selectedTownId.toString());
    console.log(selectedAddress.toString(), selectedRegionId.toString());
    console.log(selectedBuilding.toString());
    console.log(selectedFloor.toString());
    if (!userToken) {
      alert(language === 'ar' ? 'التوكن غير موجود. قم بتسجيل الدخول مرة أخرى.' : 'Token not found. Please log in again.');
      return;
    }

    if (!selectedRegionId || !selectedBuilding || !selectedFloor) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields.');
      return;
    }

    const formData = new FormData();

    formData.append("floor_number", selectedFloor.toString());
    formData.append("building_number", selectedBuilding.toString());
    formData.append("location_id", selectedTownId.toString());
    formData.append("address", selectedAddress.toString());
    formData.append("region_id", selectedRegionId.toString());

    try {
      const res = await axios.post(
        `https://tarshulah.com/api/customer/address/update/${id}`,
        formData,
        {
          headers: {
            "Accept": "application/json",
            'Authorization': userToken
          }
        }
      );
      queryClient.invalidateQueries(["getAddressList", language]);
      // console.log('Success:', res.data);
      // console.log('Success:', res.data?.data.address.location_id);
      // console.log('Success:', res.data?.data.address.region_id);
      alert(language === 'ar' ? 'تم تعديل العنوان بنجاح' : 'Address updated successfully');
      if (isShown == true) {
        setIsShown(false);
      }
    } catch (error) {
      console.error('Error:', error.response || error.message);
      alert(language === 'ar' ? 'حدث خطأ أثناء التعديل: ' + error.response?.data?.message : 'An error occurred while updating: ' + error.response?.data?.message);
    }
  };
  const handleCancel = () => {
    if (isShown == true) {
      setIsShown(false);
    }
  };
  // Main Component
  return (
    <>
      {address && (<div className="container mx-auto px-4 py-6 mt-20">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          {language === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses'}
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map(address => (
            <div
              key={address.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {address.location_name}
                  </h2>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-3 text-green-500" />
                    <p>
                      {language === 'ar' ? 'رقم المبنى:' : 'Building Number:'} {' '}
                      <span className="font-medium">{address.building_number}</span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Layers className="w-5 h-5 mr-3 text-purple-500" />
                    <p>
                      {language === 'ar' ? 'رقم الطابق:' : 'Floor Number:'} {' '}
                      <span className="font-medium">{address.floor_number}</span>


                    </p>
                  </div>

                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="truncate">
                      {address.region_name}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <button
                      className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
                      onClick={() => handleDelete(address.id)}
                    >
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </button>

                    <button
                      className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
                      onClick={() => handleUpdate(event, address.id)}
                    >
                      {language === 'ar' ? 'تعديل' : 'Update'}
                    </button>

                  </div>
                </div>
              </div>
            </div>
          ))}
          {isShown ? <>
            <div className="fixed bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100 bg-white h-96 top-[10%] right-[25%] z-500 w-[50%] h-[80%]">
              <button className="absolute left-4 top-4" onClick={handleCancel}>
                <MdCancel className="w-6 h-6" />
              </button>
              <h1 className={`font-bold text-2xl text-center mb-4 mt-2`}>{language === "ar" ? "تعديل العنوان" : "Address Update"}</h1>
              <h3 className='text-center font-bold text-2xl pt-2 pr-2'>
                {language === 'ar' ? 'يرجى اختيار المحافظة' : 'Please select the city'}
              </h3>
              <div className='w-[70%] pt-2 pr-2 mx-auto'>
                <select
                  name='town'
                  className='w-full h-10 border border-gray-400 outline-none'
                  onChange={() => handleTownChange(event)}
                >
                  <option value="" disabled>
                    {language === 'ar' ? 'اختر المحافظة' : 'Select city'}
                  </option>
                  {towns.map((town) => (
                    <option key={town.id} value={town.id}>
                      {town.name}
                    </option>
                  ))}
                </select>

                {/* اختيار المنطقة */}
                <h3 className='text-center font-bold text-2xl pt-2'>
                  {language === 'ar' ? 'يرجى اختيار المنطقة' : 'Please select the region'}
                </h3>
                <div className="pt-2">
                  <select
                    name='region'
                    className='w-full h-10 border border-gray-400 outline-none'
                    onChange={() => handleRegionChange(event)}
                    disabled={!regions.length}
                  >
                    <option value="" disabled>
                      {language === 'ar' ? 'اختر المنطقة' : 'Select region'}
                    </option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Building Number */}
                <h3 className='text-center font-bold text-2xl my-2'>
                  {language === 'ar' ? 'رقم المبنى' : 'Building number'}
                </h3>
                <input
                  placeholder={language === "ar" ? "من فضلك ادخل رقم المبنى" : "Please Enter Building Number"}
                  className='w-full h-10 border border-gray-400'
                  onChange={() => handleBuildingChange(event)}
                  defaultValue={building}
                />

                {/* Floor Number */}
                <h3 className='text-center font-bold text-2xl my-2'>
                  {language === 'ar' ? 'رقم الطابق' : 'Floor number'}
                </h3>
                <input
                  placeholder={language === "ar" ? "من فضلك ادخل رقم الطابق" : "Please Enter Floor Number"}
                  className='w-full h-10 border border-gray-400 mb-6'
                  onChange={() => handleFloorChange(event)}
                  defaultValue={floor}
                />
              </div>
              <div className="w-[30%] mx-auto">
                <button
                  className="w-[100%] h-12 mb-4  text-center text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
                  onClick={() => handleConfirm(addressId)}
                >
                  {language === 'ar' ? 'تم' : 'Confirm'}
                </button>
              </div>
            </div></> : <></>}
        </div>
      </div >)
      }
    </>


  );
}