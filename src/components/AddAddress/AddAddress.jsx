import { useContext, useState } from 'react';
import { useLanguage } from '../../context/LanguageContextPro';
import { ContextData } from '../../context/ContextApis';
import axios from 'axios';
import Address from '../Address/Address';

function AddAddress({ showAddress = true }) {
    const { settings_domain, userToken } = useContext(ContextData);
    const { language } = useLanguage();
    const towns = settings_domain?.data?.locations || [];

    const token = userToken.startsWith("bearer") ? userToken : `Bearer ${userToken}`;

    // States
    const [selectedTownId, setSelectedTownId] = useState('');
    const [regions, setRegions] = useState([]);
    const [selectedRegionId, setSelectedRegionId] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [address, setAddress] = useState('');
    const [shippingPrice, setShippingPrice] = useState(''); // New state for shipping price

    // Handle Building and Floor input changes
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
        setAddress('');
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
        setAddress(combinedAddress);
    };

    // Handle Submit
    const handleClick = async () => {
        if (!token) {
            alert(language === 'ar' ? 'التوكن غير موجود. قم بتسجيل الدخول مرة أخرى.' : 'Token not found. Please log in again.');
            return;
        }

        if (!selectedRegionId || !selectedBuilding || !selectedFloor) {
            alert(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append("location_id", selectedTownId);
        formData.append("region_id", selectedRegionId);
        formData.append("address", address);
        formData.append("building_number", selectedBuilding);
        formData.append("floor_number", selectedFloor);

        try {
            const res = await axios.post("https://tarshulah.com/api/customer/address/store", formData, {
                headers: { "Authorization": token },
            });
            console.log('Success:', res.data);
            console.log('Success:', res.data?.data.address.location_id);
            console.log('Success:', res.data?.data.address.region_id);
            alert(language === 'ar' ? 'تم إضافة العنوان بنجاح' : 'Address added successfully');
        } catch (error) {
            console.error('Error:', error.response || error.message);
            alert(language === 'ar' ? 'حدث خطأ أثناء الإضافة: ' + error.response?.data?.message : 'An error occurred while adding: ' + error.response?.data?.message);
        }
    };

    return (
        <div className='container '>
            {/* اختيار المحافظة */}
            <h3 className='text-start font-bold text-2xl'>
                {language === 'ar' ? 'يرجى اختيار المحافظة' : 'Please select the city'}
            </h3>
            <div className='w-[70%]'>
                <select
                    name='town'
                    className='w-full h-10 border border-gray-400 outline-none'
                    value={selectedTownId}
                    onChange={handleTownChange}
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
                <h3 className='text-start font-bold text-2xl mt-4'>
                    {language === 'ar' ? 'يرجى اختيار المنطقة' : 'Please select the region'}
                </h3>
                <select
                    name='region'
                    className='w-full h-10 border border-gray-400 outline-none'
                    value={selectedRegionId}
                    onChange={handleRegionChange}
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

                {/* عرض سعر الشحن */}
                {/* {shippingPrice && (
                    <p className='text-start font-bold text-xl mt-4'>
                        {language === 'ar' ? `سعر الشحن: ${shippingPrice}` : `Shipping Price: ${shippingPrice}`}
                    </p>
                )} */}

                {/* Building Number */}
                <h3 className='text-start font-bold text-2xl my-2'>
                    {language === 'ar' ? 'رقم المبنى' : 'Building number'}
                </h3>
                <input
                    placeholder={language === "ar" ? "من فضلك ادخل رقم المبنى" : "Please Enter Building Number"}
                    className='w-full h-10 border border-gray-400'
                    onChange={handleBuildingChange}
                />

                {/* Floor Number */}
                <h3 className='text-start font-bold text-2xl my-2'>
                    {language === 'ar' ? 'رقم الطابق' : 'Floor number'}
                </h3>
                <input
                    placeholder={language === "ar" ? "من فضلك ادخل رقم الطابق" : "Please Enter Floor Number"}
                    className='w-full h-10 border border-gray-400'
                    onChange={handleFloorChange}
                />
            </div>

            {/* Submit Button */}
            <div className='mt-10 w-fit mx-auto'>
                <button
                    className='flex items-center justify-center px-4 py-2 bg-primary duration-300 rounded-lg text-white hover:shadow-lg hover:shadow-gray-300'
                    onClick={handleClick}
                >
                    {language === 'ar' ? 'اضافة عنوان' : 'Add Address'}
                </button>
            </div>
             {showAddress && <Address />}
        </div>
    );
}

export default AddAddress;
