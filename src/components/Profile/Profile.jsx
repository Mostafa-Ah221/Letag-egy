import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ContextData } from '../../context/ContextApis';

export default function Profile() {
    const { userData } = useContext(ContextData);
  
  return (
    <>
      <div className='my-16'>
       
        
        <div className='flex flex-col lg:flex-row'>

       
          <div className='flex flex-col justify-center item-center w-64'>
            <div>
              <p className=''> مرحبا <span className='font-semibold text-primary'>{userData?.name}</span></p>
            </div>
            <div>
              <p className=''> <span><Link className='hover:underline hover:text-primary'>تسجيل الخروج</Link></span></p>
            </div>
            <div className='w-full'>
              <p className='w-full'>من لوحة معلومات حسابك ، يمكنك عرض <span><Link className='hover:text-primary'>الطلبات السابقة</Link></span> و <span><Link className='hover:text-primary'>تعديل كلمة المرور وتفاصيل الحساب.</Link></span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
