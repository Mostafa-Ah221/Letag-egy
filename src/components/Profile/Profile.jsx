import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ContextData } from '../../context/ContextApis';
import { useLanguage } from '../../context/LanguageContextPro'; // التأكد من استيراد useLanguage

export default function Profile() {
    const { userData } = useContext(ContextData);
    const { language } = useLanguage();
  
  return (
    <>
      <div className='my-16'>
        <div className='flex flex-col lg:flex-row'>
          <div className='flex flex-col justify-center item-center '>
            <div>
              <p className=''>
                {language === 'ar' ? ' مرحبا ' : 'Hello '} 
                <span className='font-semibold text-primary'>{userData?.name}</span>
              </p>
            </div>
            <div>
              <p className=''>
                <span>
                  <Link className='hover:underline hover:text-primary'>
                    {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </Link>
                </span>
              </p>
            </div>
            <div className='w-full'>
              <p className='w-full'>
                {language === 'ar' ? (
                  <>من لوحة معلومات حسابك ، يمكنك عرض <span><Link className='hover:text-primary'>الطلبات السابقة</Link></span> و <span><Link className='hover:text-primary'>تعديل كلمة المرور وتفاصيل الحساب</Link></span>.</>
                ) : (
                  <>From your account dashboard, you can view <span><Link className='hover:text-primary'>previous orders</Link></span> and <span><Link className='hover:text-primary'>edit your password and account details</Link></span>.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
