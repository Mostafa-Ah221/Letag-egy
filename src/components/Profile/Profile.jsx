import React from 'react'
import { Link } from 'react-router-dom'
import ConstantDetails from '../ConstantDetails/ConstantDetails'

export default function Profile() {
  return (
    <>
      <div className='my-16'>
        <h1 className='absolute right-20 font-bold text-3xl'> حسابى</h1>
        <div className='flex flex-col lg:flex-row-reverse'>
          <ConstantDetails />
          <div className='container flex flex-col lg:mx-2'>
            <h1 className='font-bold text-3xl text-right'>حساب المستخدم</h1>
            <div className='bg-gradient-to-t from-primary700 to-primary w-96 mt-2 relative rounded-lg h-40 ml-auto'>
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
          <div className='flex flex-col h-28 w-52 rounded-lg ml-auto shadow-lg'>
            <div className='bg-white h-14 w-52 text-center pt-4 rounded-lg'>الأرصدة المتبقية</div>
            <div className='bg-[#d4d4d4] h-14 w-52 text-center text-primary pt-4 rounded-lg'>EGP 0.00</div>
          </div>
          <div className='flex flex-col h-28 w-52 lg:mx-2 rounded-lg ml-auto shadow-lg'>
            <div className='bg-white h-14 w-52 text-center pt-4 rounded-lg'>رصيد الطلبات الملغية</div>
            <div className='bg-[#d4d4d4] h-14 w-52 text-center text-primary pt-4 rounded-lg'>EGP 0.00</div>
          </div>
        </div>
      </div>
    </>
  )
}
