import React, { useEffect, useState } from 'react'
import { TbSort09 } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from "../../context/LanguageContextPro";

function Stock() {
    const navigate = useNavigate();;
    const [towns, setTowns] = useState([]);
    const [cityId, setCityId] = useState(null);
    const { language } = useLanguage();

    const handleInput = async (e) => {
        const res = await fetch("https://tarshulah.com/api/domain/settings");
        const resJson = await res.json();
        const data = await resJson.data;
        const resTowns = await data.locations;
        const resregion = await resTowns.map((t) => t.regions);
        let r = {};
        for (var i in resregion) {
            for (var j in resregion[i]) {
                if (resregion[i][j].name == e.target.value) {
                    r = resregion[i][j];
                }
            }
        }
        // console.log(r);
        // console.log(resregion);
        setCityId(r);
    };

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
    return (
        <>
            <div className='container'>
                <h1 className={`text-center font-bold text-3xl`}>يرجى اختيار المدينة الذي تريد التوصيل إليه</h1>
                <select name='town' className='absolute right-0 w-96 h-6 my-16 w-96 mr-56 bg-[#a3a3a3] text-white' onInput={handleInput}>
                    <option value={""}>اختر من المدن الاتية</option>
                    {towns?.map((t) => (
                        <>
                            <option disabled className='text-black text-end' value={t.name}>{t.name}</option>
                            {t?.regions.map((r) => (
                                <>
                                    <option className='text-white text-end' value={r.name}>{r.name}</option>
                                </>
                            ))}
                        </>
                    ))}
                </select >
                <div className={`mt-28`}>
                    <button className={`bg-primary w-32 h-12 flex item-center justify-center absolute right-2 mr-52 text-white pt-3 hover:text-black hover:bg-white rounded-xl`} onClick={() => { cityId ? navigate("home", { id: cityId.id }) : <div></div> }}>اظهار المنتجات</button>
                </div>
                <div className='absolute right-2 mr-52 mt-20'>
                    <img src='../../../src/assets/images/favicon.png' alt="logo" />
                </div>
            </div>
        </>
    )
}

export default Stock
