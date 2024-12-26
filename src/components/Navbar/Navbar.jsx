import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContextPro";
import { ContextData } from "../../context/ContextApis";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

import { useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [ca2, setCa2] = useState({});
  const [catChildren2, setCatChildren2] = useState([]);
  const { subCategories, userData, settings_domain, selectedTownId, setSelectedTownId } = useContext(ContextData);
  const [isStock, setIsStock] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [searchData2, setSearchData2] = useState(null);
  const [query, setQuery] = useState("");
  let location = useLocation();
  // const [query2, setQuery2] = useState("");


  let filteredSuggestions = [];
  let filteredSuggestionsProducts = [];

  const logo = settings_domain?.data.logo
  // console.log(logo);

const handleOpenMenu = () => {
  const newState = !isOpen; // Toggle the state
  setIsOpen(newState);

  if (newState) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }
};

  const { data, isLoading, isError } = useQuery({
    queryKey: ["subCategory", language],
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

 const handlChange = async (e) => {
  const value = e.target.value;
  setQuery(value);

  if (!value) {
    setSearchData2(null);
    setSearchData(null);
    return;
  }

  const formData = new FormData();
  formData.append("search", value);
  if (selectedTownId != null) {
    formData.append("city_id", selectedTownId);
  }

  try {
    const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
      headers: { lang: language },
    });
    const resdata = response.data?.data?.products || [];
    setSearchData2(resdata);
  } catch (error) {
    console.error("Error fetching products:", error);
    setSearchData2([]);
  }

  const filteredSuggestions = data?.data.categories.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );
  setSearchData(filteredSuggestions.length ? filteredSuggestions : null);
};

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full z-40 overflow-y-auto ${isOpen ? "block" : "hidden"
          } ${isOpen ? "animate-slideInRight bg-white " : ""}`}>
        <div className="p-6">
          <IoMdClose
            onClick={handleOpenMenu}
            className="cursor-pointer text-slate-600 self-end mr-auto text-3xl border border-primary rounded-md mb-4"
          />
          <div className=" flex flex-row-reverse justify-center items-center text-primary text-2xl mb-3 font-thin gap-2">
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
              <CgProfile className="text-4xl text-gray-500" />
            </div>
          </div>
        </div>
          
        {data?.data.categories.map((cat) => (
          <React.Fragment key={cat.id}>
            <div
              className={`w-full h-12 bg-white flex mt-5 px-2`}
            >
              <Link to={`/categoryDetails/${cat.id}`} onClick={() => { handleOpenMenu() }} className="flex items-center"
              >
                <img src={cat.photo} alt={cat.name} className="mx-2 my-4 w-12 h-12" />
                <p className="mx-2 my-4">{cat.name}</p>
              </Link>
              <button
                className={`${language === "ar" ? "mr-auto" : "ml-auto"
                  } my-4`}
                onClick={() => handleOpenSubMenu(cat.name, cat.id)}
              >
                {openSubMenus[cat.id] ? <FaArrowDown className="text-slate-600" /> : <FaArrowLeft className="text-slate-600" />}
              </button>
            </div>
            <div
              className={`bg-white w-full flex flex-col ${openSubMenus[cat.id] ? "block" : "hidden"
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
                    className={`bg-white flex ${language === "ar" ? "flex-row" : "flex-row-reverse"
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

      <nav className="border-gray-200 relative z-10 bg-white">
        <div className="flex-row justify-start flex flex-wrap items-center lg:justify-around mx-auto p-4">
          <Link to={"/"} className={`flex items-center space-x-3 ${language === "ar" ? "ml-20" : "mr-20"}  md:ml-0 rtl:space-x-reverse`}>
            <img src={logo} className="h-10" alt="Logo" />
          </Link>
          <div className={`absolute top-4 ${language === "ar" ? "left-4 " : "right-4 "} flex items-center`}>
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
            <ul className="lg:flex font-medium gap-5 hidden">
              <li>
                <Link to={isStock ? "/home" : "/"} className="relative block py-2 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-primary transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "الرئيسية" : "Home"}
                  </span>
                </Link>
              </li>
              <li>
                <Link to={"/about"} className="relative block py-2  rounded md:p-0 group">
                <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-primary transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "نبذة عنا" : "About"}
                  </span>
                </Link>
              </li>
              <li>
                <Link to={"/pageBrand"} className="relative block py-2  rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-primary transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "العلامات التجارية" : "Brands"}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex md:order-1 mr-3">
            <div className="relative hidden md:block">
              <div  className="">
                <button className={`absolute inset-y-0 flex items-center ${language === "ar" ? "pr-2 left-2" : "pl-2 right-2"} z-100`} onClick={() => {
                  setSearchData(null); setQuery(""); setSearchData2(null);
                }}>
                  <p className="p-[7px] bg-primary hover:cursor-pointer">
                    <svg className="w-4 h-4 text-gray-100 hover:cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </p>
                  <span className="sr-only">Search icon</span>
                </button>
              </div>
              <input
                type="search"
                id="search-navbar"
                className="block lg:w-[30em] md:w-[25em] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] z-0"
                placeholder={language === "ar" ? "ابحث عن منتج" : "Search for a product"}
                onChange={handlChange}
                value={query}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ml-[9.7rem] ">
          <div
            className={`${searchData || searchData2 ? "flex" : "hidden"
              }  bg-white flex-col z-50 absolute top-14 lg:w-[32%] h-96 md:w-[25em] rounded-md shadow-lg border border-gray-200 overflow-auto`}>

            <p
              className={`text-gray-600 text-sm px-4 py-2 `}>
              {language === "ar" ? "المنتجات" : "Products"}
            </p>
            {searchData2 && (
              <>
                {searchData2.map((product, index) => (
                  <Link
                    key={index}
                    to={`/productDetails/${product.id}`}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 `}
                    onClick={() => {
                      setSearchData(null);
                      setQuery("");
                      setSearchData2(null);
                    }}>
                    <img
                      src={product.photo}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-md border border-gray-300"
                    />
                    <p className="text-gray-800 hover:text-primary text-sm">
                      {product.title}
                    </p>
                  </Link>
                ))}
                <hr className="my-2" />
              </>
            )}

            <p
              className={`text-gray-600 text-sm px-4 py-2 `}>
              {language === "ar" ? "الفئات" : "Categories"}
            </p>
            {searchData && (
              <>
                {searchData.map((category, index) => (
                  <Link
                    key={index}
                    to={`/categoryDetails/${category.id}`}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 `}
                    onClick={() => {
                      setSearchData(null);
                      setQuery("");
                      setSearchData2(null);
                    }}>
                    <img
                      src={category.photo}
                      alt={category.name}
                      className="w-10 h-10 object-cover rounded-md border border-gray-300"
                    />
                    <p className="text-gray-800 hover:text-primary text-sm">
                      {category.name}
                    </p>
                  </Link>
                ))}
                <hr className="my-2" />
              </>
            )}

            <Link to={`/SearchByItem/${query}`} className={`bg-white rounded-xl w-48 border-black border-2 hover:border-primary ${language === "ar" ? "mr-auto" : "ml-auto"}`}><button onClick={() => { setSearchData(null); setQuery(""); setSearchData2(null); }}><p className="px-4 py-1">{language === "ar" ? "عرض جميع المنتجات" : "View All Products"}</p></button></Link>
          </div>
        </div>

      </nav>
    </>
  );
}