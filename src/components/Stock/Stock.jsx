import React, { useEffect, useState } from 'react'
function Stock() {
    const [towns, setTowns] = useState([]);
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await fetch("https://tarshulah.com/api/domain/settings");
                const resJson = await res.json();
                const data = await resJson.data;
                const resTowns = data.locations;
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
                <select name='town' className='absolute right-0 w-96 h-6 my-16 w-96 mr-56 bg-[#a3a3a3] text-white'>
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
                    <button className={`bg-primary w-32 h-12 flex item-center justify-center absolute right-2 mr-52 text-white pt-3 hover:text-black hover:bg-white rounded-xl`}>اظهار المنتجات</button>
                </div>
                <div className='absolute right-2 mr-52 mt-20'>
                    <img src='../../../src/assets/images/favicon.png' alt="logo" />
                </div>
            </div>
        </>
    )
}

export default Stock
