import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { language,toggleLanguage } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [ca2, setCa2] = useState({});
  const [catChildren2, setCatChildren2] = useState([]);
  const { subCategories, userData,settings_domain } = useContext(ContextData);
  const [isStock, setIsStock] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const logo=settings_domain?.data.logo
  // console.log(logo);
  
  const handleOpenMenu = () => {
    if (isOpen) {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      setIsOpen(false);
    } else {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setIsOpen(true);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["subCategory",language],
    queryFn: subCategories,
  });

  const handleOpenSubMenu = async (cName, categoryId) => {
    setOpenSubMenus((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId], 
    }));
    if (!openSubMenus[categoryId]) {
      const ca = await data?.data.categories.filter((cat) => cat.name === cName);
      const catChildren = ca[0]?.childrenCategories || [];
      setCa2(ca);
      setCatChildren2(catChildren);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("https://tarshulah.com/api/domain/settings");
        const resJson = await res.json();
        const data = await resJson.data;
        setIsStock(data.multi_stocks_management === 1);
      } catch (error) {
        console.error(error);
      }
    };
    fetchdata();

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-40 overflow-y-auto ${
          isOpen ? "block" : "hidden"
        } ${isOpen ? "animate-slideInRight" : ""}`}
      >
        <div className="p-6 ">
          <div className={`flex  ${language === "ar" ? "flex-row-reverse":"flex-row"} items-center `}>
             <IoMdClose 
            onClick={handleOpenMenu} 
            className="cursor-pointer text-slate-600 self-end mr-auto text-3xl border border-primary rounded-md mb-4" 
          />
          <div className=" flex flex-row-reverse justify-center items-center mr-auto mb-4 text-primary text-2xl  font-thin gap-2">
            {userData === null ? 
               <Link
                  to="/login"
                  onClick={() => {
                      handleOpenMenu(); 
                    }}
                >
                    {language === 'ar' ? ' تسجيل الدخول' : ' Login'}
                </Link>
            :
               <Link
                  to="/profile"
                   onClick={() => {
                      handleOpenMenu(); 
                    }}
                >
                  {userData.name}
                </Link>
              }
                 <div className="icon-profile">
                      <CgProfile className="text-4xl text-gray-500"/>
                  </div>
          </div>
          </div>
         
          {data?.data.categories.map((cat) => (
            <React.Fragment key={cat.id}>
              <div
                className={`w-full h-12 bg-white flex mt-5 `}
              >
                <Link to={`/categoryDetails/${cat.id}`}  onClick={() => {handleOpenMenu()}} className="flex items-center"
                > 
                <img src={cat.photo} alt={cat.name} className="mx-2 my-4 w-12 h-12" />
                <p className="mx-2 my-4">{cat.name}</p>
                </Link>
                <button
                  className={`${
                    language === "ar" ? "mr-auto" : "ml-auto"
                  } my-4`}
                  onClick={() => handleOpenSubMenu(cat.name, cat.id)}
                >
                  {openSubMenus[cat.id] ? <FaArrowDown className="text-slate-600" /> : <FaArrowLeft className="text-slate-600" />}
                </button>
              </div>
              <div
                className={`bg-white w-full flex flex-col ${
                  openSubMenus[cat.id] ? "block" : "hidden"
                }`}
              >
                {catChildren2.map((cat) => (
                  <Link
                    className=""
                    to={`/categoryDetails/${cat.id}`}
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      handleOpenMenu(); 
                    }}
                  >
                    <div
                      className={`bg-white flex ${
                        language === "ar" ? "flex-row" : "flex-row-reverse"
                      } mx-2 my-4`}
                    >
                      {cat.name}
                    </div>
                  </Link>
                ))}
              </div>
              <hr className="my-4 bg-gray-200" />
            </React.Fragment>
          ))}
        </div>
      </div>

       <nav className="border-gray-200 relative z-10">
        <div className="flex-row justify-start flex flex-wrap items-center lg:justify-around mx-auto p-4">
          <Link to={"/"} className={`flex items-center space-x-3 ${language === "ar" ? "ml-20":"mr-20"}  md:ml-0 rtl:space-x-reverse`}>
            <img src={logo} className="h-10" alt="Logo" />
          </Link>
          <div className={`absolute  top-4 ${language === "ar" ? "left-4 " : "right-4 "} flex items-center`}>
            <div
                    className=" group hover:cursor-pointer m-2 lg:hidden"
                    onClick={toggleLanguage} 
                >
                    <p className="text-black text-center ">
                        {language === "ar" ? "EN" : "AR"}
                    </p>
                </div>
            <button
            data-collapse-toggle="navbar-search"
            type="button"
            className=" items-center justify-center p-2 w-10 h-10 text-gray-500 rounded-lg lg:hidden hover:border hover:border-primary duration-200 cursor-pointer"
            aria-controls="navbar-search"
            aria-expanded={isMenuOpen}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14" onClick={handleOpenMenu}>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          
          </div>
          

          <div className={`items-center  justify-between w-full lg:flex lg:w-auto md:order-2 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-search">
            <ul className="lg:flex font-medium lg:space-x-8 lg:bg-white hidden">
              <li>
                <Link to={isStock ? "/home" : "/"} className="relative block py-2 px-3 ml-2 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-primary transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "الرئيسية" : "Home"}
                  </span>
                </Link>
              </li>
              <li>
                <Link to={"/about"} className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-primary transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "نبذة عنا" : "About"}
                  </span>
                </Link>
              </li>
              <li>
                <Link to={"/pageBrand"} className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-primary transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "العلامات التجارية" : "Brands"}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex  md:mr-3 mt-3 md:mt-0">
            <div className="relative w-[17rem] lg:w-[23em] md:w-[22em] mr- md:mr-0">
              <div className="absolute z-40 inset-y-0 start-0 flex items-center ps-3">
                <div className="p-[7px] bg-primary cursor-pointer">
                  <svg className="w-4 h-4 text-gray-100 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <span className="sr-only">Search icon</span>
              </div>
              <input
                type="search"
                id="search-navbar"
                className="block w-full p-2 ps-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-right outline-none dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)]"
                placeholder={language === "ar" ? "ابحث عن منتج" : "Search for a product"}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}