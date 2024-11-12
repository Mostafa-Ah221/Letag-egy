import React from 'react'
import { Link } from 'react-router-dom'

function ConstantDetails() {
    return (
        <>
            <div className='container flex flex-col w-96 bg-white shadow-lg rounded-lg mt-12 text-right ml-auto'>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>الملف الشخصى</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>البيانات</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>العنوان</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>المفضلة</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>المحفظة</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>المقارنة</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>الطلبات</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>الطلبية</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>تسجيل الخروج</h3></Link>
            </div>
        </>
    )
}

export default ConstantDetails
