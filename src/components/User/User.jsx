import { Link, Outlet } from "react-router-dom";
import ConstantDetails from "../ConstantDetails/ConstantDetails";

export default function User() {
  return (
    <div>
        <div className=''>
          <h1 className='text-center font-bold text-3xl my-5'>لوحة التحكم بالنظام</h1>
          <div className='my-4 flex flex-row-reverse justify-center item-center'>
          <Link className='hover:text-primary hover:underline' to={"/"}>الرئيسية</Link>
          <p className='mx-2'>/</p>
          <Link className='text-primary'>لوحة التحكم بالنظام</Link>
        </div>
        </div>
    <div className="grid grid-cols-12 gap-11 w-full">
     <div className="col-span-12 lg:col-span-5 mx-5">
        <ConstantDetails/>
     </div>
      
        <div className="col-span-12 lg:col-span-7">
         <Outlet />
        </div>
    </div>
    </div>
  )
}
