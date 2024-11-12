import React from 'react'
import { Link } from 'react-router-dom'

export default function Profile() {
  return (
    <>
      <div className='my-16'>
        <h1 className='absolute right-20 font-bold text-3xl'>حسابى</h1>
        <div className='flex flex-col lg:flex-row-reverse'>
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
          <div className='container flex flex-col lg:mx-2'>
            <h1 className='font-bold text-3xl text-right'>حساب المستخدم</h1>
            <div className='bg-primary w-96 mt-2 relative rounded-lg h-40 ml-auto'>
              <h1 className='text-right font-bold text-3xl text-white pt-4 pr-2'>محفظة المستخدم</h1>
              <p className='text-white pl-2 py-2'>26038*** *** ***</p>
              <p className='text-white text-right pr-2'>الرصيد المتاح</p>
              <h1 className='text-right font-bold text-3xl text-white pr-2'>EGP 0.00</h1>
            </div>
            <h1 className='text-right font-bold text-3xl mt-6'>احدث الطلبات</h1>
            <p className='text-right mt-2'>No Orders Found</p>
            <h1 className='text-right font-bold text-3xl mt-6'>احدث المعاملات</h1>
            <p className='text-right mt-2'>No Orders Found</p>
          </div>
          <div className='flex flex-col w-52 rounded-lg ml-auto'>
            <div className='bg-white h-14 w-52 text-center pt-4 rounded-lg'>الأرصدة المتبقية</div>
            <div className='bg-[#d4d4d4] h-14 w-52 text-center text-primary pt-4 rounded-lg'>EGP 0.00</div>
          </div>
          <div className='flex flex-col w-52 lg:mx-2 rounded-lg ml-auto'>
            <div className='bg-white h-14 w-52 text-center pt-4 rounded-lg'>رصيد الطلبات الملغية</div>
            <div className='bg-[#d4d4d4] h-14 w-52 text-center text-primary pt-4 rounded-lg'>EGP 0.00</div>
          </div>
        </div>
      </div>
    </>
  )
}
