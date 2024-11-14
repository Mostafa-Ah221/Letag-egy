import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ContextData } from '../../context/ContextApis'

function ConstantDetails() {
        let {userToken,setUserToken}=useContext(ContextData)

    const navigate=useNavigate()
    function Logout() {
        navigate('/')
        setUserToken(null)
        localStorage.removeItem('userToken')
    }
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
                <Link onClick={()=> Logout()} ><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>تسجيل الخروج</h3></Link>
            </div>
        </>
    )
}

export default ConstantDetails
