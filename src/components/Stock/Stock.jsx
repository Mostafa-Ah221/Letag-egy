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
            <h1 className='text-center font-bold text-2xl mt-10'>
                يرجى اختيار المدينة الذي تريد التوصيل إليه
            </h1>
            <select
                name='town'
                className=' w-[80%] h-10 mt-12 border border-gray-400 focus:shadow-[0_0_8px_2px_rgba(149,115,22,0.2)] outline-none'
                value={selectedTownId}
                onChange={handleTownChange}
            >
                <option value="" disabled>
                    اختر المدينة
                </option>
                {towns?.map((t) => (
                    <React.Fragment key={t.id}>
                        <option disabled className=' font-bold text-[1.20rem]' value={t.id}>
                            {t.name}
                        </option>
                        {t?.regions.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </React.Fragment>
                ))}
            </select>
            <div className='mt-10 w-fit'>
                <Link to="/home">
                    <button className=' flex items-center justify-center px-2 py-2 bg-primary duration-300  rounded-lg text-white hover:shadow-lg hover:shadow-gray-300 '>
                        اظهار المنتجات
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
