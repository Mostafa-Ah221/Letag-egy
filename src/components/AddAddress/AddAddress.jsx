import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContextData } from '../../context/ContextApis';
import { useLanguage } from '../../context/LanguageContextPro';
import axios from "axios";

function AddAddress() {
    const { selectedTownId, setSelectedTownId, settings_domain } = useContext(ContextData);
    const { language } = useLanguage();
    const [selectedTownId2, setSelectedTownId2] = useState(null);
    const [selectedTown2, setSelectedTown2] = useState(null);
    const favicon = settings_domain?.data.logo
    const towns = settings_domain?.data?.locations || [];
    const token = localStorage.getItem("userToken");
    const [selectedBuilding, setSelectedBuilding] = useState();
    const [selectedFloor, setSelectedFloor] = useState();
    const handleChange1 = (event) => {
        const sb = event.target.value;
        setSelectedBuilding(sb);
    };
    const handleChange2 = (event) => {
        const sf = event.target.value;
        setSelectedFloor(sf);
    };
    const handleClick = async () => {
        const formData = new FormData();
        formData.append("location_id", selectedTownId2);
        formData.append("address", selectedTown2);
        formData.append("building_number", selectedBuilding);
        formData.append("floor_number", selectedFloor);
        try {
            const res = await axios.post("http://tarshulah.com/api/customer/address/store", formData, {
                headers: { "Authorization": token }
            });
        } catch (error) {
            console.loge(error);
        }
    };
    const handleTownChange = async (event) => {
        const selectedId = event.target.value;
        setSelectedTownId2(selectedId);
        let town = {};
        // console.log(town);
        // console.log(towns);
        for (var i in towns) {
            let re = towns[i].regions;
            for (var j in re) {
                if (re[j].id == selectedId) {
                    town = re[j];
                    break;
                }
            }
        }
        // console.log(town.name);
        setSelectedTown2(town);
    };
    useEffect(() => {
    }, []);
    return (
        <>
            <div className='container mb-[9.3rem]'>
                <h3 className='text-start font-bold text-2xl mt-10'>
                    {language === 'ar' ? 'يرجى اختيار المدينة الذي تريد التوصيل إليه' : 'Please select the city you want to deliver to'}
                </h3>
                <select
                    name='town'
                    className='w-[80%] h-10 mt-4 border border-gray-400 focus:shadow-[0_0_8px_2px_rgba(149,115,22,0.2)] outline-none'
                    value={selectedTownId2 || ""}
                    onChange={handleTownChange}
                >
                    <option value="" disabled>
                        {language === 'ar' ? 'اختر المدينة' : 'Select the city'}
                    </option>
                    {towns.map((t) => (
                        <React.Fragment key={t.id}>
                            <option disabled className='font-bold text-[1.20rem]' value={t.id}>
                                {t.name}
                            </option>
                            {t?.regions?.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </React.Fragment>
                    ))}
                </select>
                <h3 className='text-start font-bold text-2xl my-2'>
                    {language === 'ar' ? 'رقم المبنى' : 'Building number'}
                </h3>
                <input name='Building number' placeholder={`${language === "ar" ? "من فضلك ادخل رقم المبنى" : "Please Enter Building Number"}`} className='w-[80%] h-10' onChange={handleChange1} />
                <h3 className='text-start font-bold text-2xl my-2'>
                    {language === 'ar' ? 'رقم الطابق' : 'Floor number'}
                </h3>
                <input name='Floor number' placeholder={`${language === "ar" ? "من فضلك ادخل رقم الطابق" : "Please Enter Floor Number"}`} className='w-[80%] h-10' onChange={handleChange2} />
                <div className='mt-10 w-fit mx-auto'>
                    <button className='flex items-center justify-center px-2 py-2 bg-primary duration-300 rounded-lg text-white hover:shadow-lg hover:shadow-gray-300' onClick={handleClick}>
                        {language === 'ar' ? 'اضافة عنوان' : 'Add Address'}
                    </button>
                </div>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Color
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                            <td class="px-6 py-4">
                                $2999
                            </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Microsoft Surface Pro
                            </th>
                            <td className="px-6 py-4">
                                White
                            </td>
                            <td className="px-6 py-4">
                                Laptop PC
                            </td>
                            <td className="px-6 py-4">
                                $1999
                            </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">
                                Black
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                            <td class="px-6 py-4">
                                $99
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AddAddress;
