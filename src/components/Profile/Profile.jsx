import React from 'react'
import { Link } from 'react-router-dom'
import ConstantDetails from '../ConstantDetails/ConstantDetails'

export default function Profile() {
  return (
    <>
      <div className='my-16'>
        <div className=''>
          <h1 className='text-center font-bold text-3xl'>لوحة التحكم بالنظام</h1>
        </div>
        <div className='my-4 flex flex-row-reverse justify-center item-center'>
          <Link className='hover:text-primary hover:underline' to={"/"}>الرئيسية</Link>
          <p className='mx-2'>/</p>
          <Link className='text-primary'>لوحة التحكم بالنظام</Link>
        </div>
        <div className='flex flex-col lg:flex-row-reverse'>
          <ConstantDetails />
          <div className='flex flex-col justify-center item-center mx-12'>
            <div>
              <p className='text-end'>amr مرحبا</p>
            </div>
            <div>
              <p className='text-end'><span><Link className='hover:underline hover:text-primary'>تسجيل الخروج</Link></span>not amr?</p>
            </div>
            <div>
              <p className='text-end'>من لوحة معلومات حسابك ، يمكنك عرض <span><Link className='hover:text-primary'>الطلبات السابقة</Link></span> و <span><Link className='hover:text-primary'>تعديل كلمة المرور وتفاصيل الحساب.</Link></span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
