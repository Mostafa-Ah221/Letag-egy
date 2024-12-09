import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ContextData } from '../../context/ContextApis'

function ConstantDetails() {
    let { setUserToken, setUserData } = useContext(ContextData)

    const navigate = useNavigate()
    function Logout() {
        navigate('/')
        setUserToken(null)
        localStorage.removeItem('userToken')
        setUserData(null)
    }
    return (
        <>
            <div className='container flex flex-col w-96 bg-white shadow-lg rounded-lg mt-12 text-right ml-12'>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>لوحة التحكم بالنظام</h3></Link>
                <hr></hr>
                <Link to={"/Orders"}><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>الطلبات</h3></Link>
                <hr></hr>
                <Link><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>تفاصيل الحساب</h3></Link>
                <hr></hr>
                <Link to={"/AddAddress"}><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>اضافة عنوان</h3></Link>
                <hr></hr>
                <Link onClick={() => Logout()} ><h3 className='hover:text-primary text-bold text-right hover:curosr-pointer py-4 px-2'>تسجيل الخروج</h3></Link>
            </div>
        </>
    )
}

export default ConstantDetails
