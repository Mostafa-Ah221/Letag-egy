import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import favicon from '../../../src/assets/images/favicon.png';
import { ContextData } from '../../context/ContextApis';

function Stock() {
    const [towns, setTowns] = useState([]);
    const { selectedTownId, setSelectedTownId } = useContext(ContextData);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await fetch("https://tarshulah.com/api/domain/settings");
                const resJson = await res.json();
                const data = await resJson.data;
                const resTowns = await data.locations;
                setTowns(resTowns);
            } catch (error) {
                console.log(error);
            }
        };
        fetchdata();
    }, []);

    const handleTownChange = (event) => {
        const selectedId = event.target.value;
        setSelectedTownId(selectedId);
        console.log(selectedId);
    };

    return (
        <div className='container'>
            <h1 className='text-center font-bold text-3xl' dir="rtl">
                يرجى اختيار المدينة الذي تريد التوصيل إليه
            </h1>
            <select
                name='town'
                className='absolute right-0 w-96 h-10 my-16 mr-56 bg-[#a3a3a3] text-white'
                value={selectedTownId}
                onChange={handleTownChange}
            >
                <option value="" disabled>
                    اختر المدينة
                </option>
                {towns?.map((t) => (
                    <React.Fragment key={t.id}>
                        <option disabled className='text-black text-end' value={t.id}>
                            {t.name}
                        </option>
                        {t?.regions.map((r) => (
                            <option key={r.id} className='text-white text-end' value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </React.Fragment>
                ))}
            </select>
            <div className='mt-28'>
                <Link to="/home">
                    <button className='bg-primary w-32 h-12 flex items-center justify-center absolute right-2 mr-52 text-white pt-3 hover:text-black hover:bg-white rounded-xl'>
                        اظهار المنتجات
                    </button>
                </Link>
            </div>
            <div className='absolute right-2 mr-52 mt-20'>
                <img src={favicon} alt="logo" />
            </div>
        </div>
    );
}

export default Stock;
