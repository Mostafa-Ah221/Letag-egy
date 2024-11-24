import { useContext, useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import logo from '../../assets/images/logo.png';
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContextPro"; 
import { ContextData } from "../../context/ContextApis";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
<<<<<<< HEAD
  const { language } = useLanguage(); 
    const { settings_domain } = useContext(ContextData);

// console.log(settings_domain?.data?.logo);
=======
  const { language } = useLanguage();
>>>>>>> 08d7d3c038ea137c498b361256f0ba814b3a86fa


  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  let ca = {};
  let catChildren = [];
  const [ca2, setCa2] = useState({});
  const [catChildren2, setCatChildren2] = useState([]);
  const { subCategories } = useContext(ContextData);
  const [isStock, setIsStock] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleOpenMenu = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ['subCategory'],
    queryFn: subCategories
  });
  const handleOpenSubMenu = async (cName, categoryId) => {
    setOpenSubMenus((prevState) => ({
      ...!prevState,
      [categoryId]: !prevState[categoryId], // Toggle the specific category's state
    }));
    if (!openSubMenus[categoryId]) {
      ca = await data?.data.categories.filter((cat) => cat.name == cName);
      catChildren = await ca[0].childrenCategories;
      setCa2(ca);
      setCatChildren2(catChildren);
      console.log(catChildren2);
      console.log(ca2);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("https://tarshulah.com/api/domain/settings");
        const resJson = await res.json();
        const data = await resJson.data;
        const stock = await data.multi_stocks_management;
        if (stock == 1) {
          setIsStock(true);
        }
        else {
          setIsStock(false);
        }
        // console.log(isStock);
      } catch (error) {
        // console.log(error)
      }
    };
    fetchdata();
  }, []);
  return (
    <>
      <div className={`bg-white h-full w-full ${isOpen ? "transition duration-1000 animate-slideInRight" : "hidden"} flex flex-col`}>
        <MdCancel onClick={handleOpenMenu} />
        {data?.data.categories.map((cat) => (
          <>
            <div className={`w-full h-12 bg-white flex ${language === "ar" ? "flex-row" : "flex-row-reverse"}`} key={cat.id}>
              <img src={cat.photo} alt={cat.name} className="mx-2 my-4 w-12 h-12" />
              <p className="mx-2 my-4">{cat.name}</p>
              <button
                className={`${language === "ar" ? "mr-auto" : "ml-auto"} my-4`}
                onClick={() => handleOpenSubMenu(cat.name, cat.id)}
              >
                {openSubMenus[cat.id] ? <FaArrowDown /> : <FaArrowLeft />}
              </button>
            </div>
            <div className={`bg-white w-full flex flex-col ${openSubMenus[cat.id] ? "block" : "hidden"}`}>
              {catChildren2.map((cat) => (
                <>
                  <Link className={``} to={`/categoryDetails/${cat.id}`} onClick={() => { setSelectedCategoryId(cat.id); setIsOpen(false); }}>
                    <div className={`bg-white flex ${language === "ar" ? "flex-row" : "flex-row-reverse"} mx-2 my-4`} key={cat.id}>
                      {cat.name}
                    </div>
                  </Link>
                </>
              ))}
            </div>
            <hr className="my-4 bg-Neutral"></hr>
          </>
        ))}
      </div >
      <nav className="border-gray-200 relative z-10">
        <div className="flex-row justify-start flex flex-wrap items-center lg:justify-around mx-auto p-4">
          <Link to={"/"} className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-10" alt="Logo" />
          </Link>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="absolute left-4 top-4 items-center justify-center p-2 w-10 h-10 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 hover:cursor-pointer"
            aria-controls="navbar-search"
            aria-expanded={isMenuOpen}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14" onClick={handleOpenMenu}>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>

          <div className={`items-center justify-between w-full lg:flex lg:w-auto md:order-2 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-search">
<<<<<<< HEAD
            <ul className="hidden lg:flex font-medium border-gray-100 rounded-lg space-x-8 rtl:space-x-reverse flex-row bg-white dark:border-gray-700">
              
=======
            <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:p-0 lg:mt-0 lg:border-0 lg:bg-white dark:border-gray-700">

>>>>>>> 08d7d3c038ea137c498b361256f0ba814b3a86fa
              <li>
                <Link to={isStock ? "/home" : "/"} className="relative block py-2 px-3 ml-2 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "الرئيسية" : "Home"}
                  </span>
                </Link>
              </li>
              <li>
                <Link to={"/about"} className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "نبذة عنا" : "About"}
                  </span>
                </Link>
              </li>


              <li>
                <Link to={"/pageBrand"} className="relative block py-2 px-3 rounded md:p-0 group">
                  <span className="absolute right-0 bottom-[-1px] h-0 w-0 bg-orange-500 transition-all duration-300 group-hover:h-[0.1em] group-hover:w-full"></span>
                  <span className="relative z-10">
                    {language === "ar" ? "العلامات التجارية" : "Brands"}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex  mr-3">
            <div className="relative hidden md:block">
              <div className="absolute z-40 inset-y-0 start-0 flex items-center ps-3 " >
                <div className="p-[7px] bg-orange-500 cursor-pointer">
                  <svg className="w-4 h-4 text-gray-100 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <span className="sr-only">Search icon</span>
              </div>
              <input
                type="search"
                id="search-navbar"
                className="block lg:w-[30em] md:w-[25em] p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-right outline-none dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)]"
                placeholder={language === "ar" ? "ابحث عن منتج" : "Search for a product"}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
