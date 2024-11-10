import { useState } from "react";
import logo from '../../assets/images/logo.png';
import { RiArrowDropDownFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="border-gray-200 shadow-lg">
        <div className="max-w-screen-xl flex-row-reverse flex flex-wrap items-center lg:justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-10" alt="Logo" />
          </a>
          <button 
            data-collapse-toggle="navbar-search" 
            type="button" 
            className="absolute left-4 top-4 items-center justify-center p-2 w-10 h-10 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
            aria-controls="navbar-search" 
            aria-expanded={isMenuOpen}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>

          <div className={`items-center justify-between w-full lg:flex lg:w-auto md:order-2 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-search">
            <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:p-0 lg:mt-0 lg:border-0 lg:bg-white dark:border-gray-700">
              <li></li>
              <li>
                <Link to={"/"} className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link to={"/about"} className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">نبذة عنا</span>
                </Link>
              </li>
              <li
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <p  className="relative block py-2 px-3 rounded md:p-0 group cursor-pointer">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">خدمات<RiArrowDropDownFill className="inline-block text-xl"/></span>
                </p>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg grid grid-cols-2 gap-4  dark:border-gray-700">
                    <Link to={"/login"} className="block px-4 py-2 hover:text-orange-500 duration-300 ">تسجيل الدخول</Link>
                    <Link to={""} className="block px-4 py-2 hover:text-orange-500 duration-300 ">Service 2</Link>
                    <Link to={""} className="block px-4 py-2 hover:text-orange-500 duration-300 ">Service 3</Link>
                    <Link to={""} className="block px-4 py-2 hover:text-orange-500 duration-300 ">Service 4</Link>
                    <Link className="block px-4 py-2 hover:text-orange-500 duration-300 ">Service 1</Link>
                    <Link to={""} className="block px-4 py-2 hover:text-orange-500 duration-300 ">Service 2</Link>
                    <Link to={""} className="block px-4 py-2 hover:text-orange-500 duration-300 ">Service 3</Link>
                    <Link to={""} className="block px-4 py-2 hover:text-orange-500 duration-300 ">Service 4</Link>
                  </div>
                )}
              </li>
              <li>
                <Link to={"/contactUs"} href="#" className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">تواصل معنا</span>
                </Link>
              </li>
              <li>
                <Link to={"/pageBrand"} href="#" className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10"> العلامات التجارية</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex md:order-1 mr-3">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <div className="p-[7px] bg-orange-500">
                  <svg className="w-4 h-4 text-gray-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <span className="sr-only">Search icon</span>
              </div>
              <input 
                type="search" 
                id="search-navbar" 
                className="block lg:w-[30em] md:w-[25em] p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-right outline-none dark:border-gray-600 dark:placeholder-gray-400  focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)]" 
                placeholder="ابحث عن منتج"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
