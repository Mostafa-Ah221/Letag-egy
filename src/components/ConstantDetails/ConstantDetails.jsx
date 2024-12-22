import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ContextData } from '../../context/ContextApis';

function ConstantDetails() {
    let { setUserToken, setUserData } = useContext(ContextData);
    const navigate = useNavigate();

    // تسجيل الخروج
    function handleLogout() {
        setUserToken(null);
        setUserData(null);
        localStorage.removeItem('userToken');
        navigate('/'); // الانتقال إلى الصفحة الرئيسية
    }

    return (
        <div className='container  flex flex-col w-96 bg-white shadow-lg rounded-lg mt-12  ml-12'>
            <NavLink 
                to="" 
                className={({ isActive }) => isActive ? "text-primary font-bold py-4 px-2" : "hover:text-primary text-bold py-4 px-2"}>
                لوحة التحكم بالنظام
            </NavLink>
            <hr />

            <NavLink 
                to="orders" 
                className={({ isActive }) => isActive ? "text-primary font-bold py-4 px-2" : "hover:text-primary text-bold py-4 px-2"}>
                الطلبات
            </NavLink>
            <hr />

            <NavLink 
                to="updateProfile" 
                className={({ isActive }) => isActive ? "text-primary font-bold py-4 px-2" : "hover:text-primary text-bold py-4 px-2"}>
                تفاصيل الحساب
            </NavLink>
            <hr />

            <NavLink 
                to="addAddress" 
                className={({ isActive }) => isActive ? "text-primary font-bold py-4 px-2" : "hover:text-primary text-bold py-4 px-2"}>
                اضافة عنوان
            </NavLink>
            <hr />

            <button
                onClick={handleLogout}
                className='hover:text-primary text-bold hover:cursor-pointer py-4 px-2 bg-transparent border-0 text-start'>
                تسجيل الخروج
            </button>
        </div>
    );
}

export default ConstantDetails;
