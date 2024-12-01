import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import favicon from '../../../src/assets/images/favicon.png';
import { ContextData } from '../../context/ContextApis';
import { useLanguage } from '../../context/LanguageContextPro';

function Stock() {
    const { selectedTownId, setSelectedTownId, settings_domain } = useContext(ContextData);
    const { language } = useLanguage();

    const towns = settings_domain?.data?.locations || []; 
console.log(settings_domain?.data.locations);

    const handleTownChange = (event) => {
        const selectedId = event.target.value;
        setSelectedTownId(selectedId);
    };

    return (
        <div className='container mb-[9.3rem]'>
            <h1 className='text-center font-bold text-2xl mt-10'>  
                {language === 'ar' ? 'يرجى اختيار المدينة الذي تريد التوصيل إليه' : 'Please select the city you want to deliver to'}
            </h1>
            <select
                name='town'
                className='w-[80%] h-10 mt-12 border border-gray-400 focus:shadow-[0_0_8px_2px_rgba(149,115,22,0.2)] outline-none'
                value={selectedTownId || ""} 
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
            <div className='mt-10 w-fit'>
                <Link to="/home">
                    <button className='flex items-center justify-center px-2 py-2 bg-primary duration-300 rounded-lg text-white hover:shadow-lg hover:shadow-gray-300'>
                        {language === 'ar' ? 'اظهار المنتجات' : 'Show products'}
                    </button>
                </Link>
            </div>
            <div className='mt-9'>
                <img src={favicon} alt="logo" />
            </div>
        </div>
    );
}

export default Stock;
