import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRightFromBracket,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { TbCircleLetterR } from "react-icons/tb";
import { IoMdHome } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import { ContextData } from "../../context/ContextApis";
import { FaRegHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useLanguage } from "../../context/LanguageContextPro";
import { useCart } from "../../context/CartContext";

function Menu() {
    const { userToken } = useContext(ContextData);
    const { language, toggleLanguage } = useLanguage();
  const {wishList } = useCart(); 

    return (
        <div className="lg:hidden rounded-tr-2xl rounded-tl-2xl bg-Neutral z-[60] flex w-full justify-between items-center fixed bottom-0 h-16">
            {/* Dynamic User Section */}
            {userToken !== null ? (
                <>
                    <NavLink
                        to={'/user'}
                        className="flex flex-col order-1 items-center w-1/5 justify-center hover:cursor-pointer group duration-300 hover:bg-primary h-full"
                    >
                        <div className="flex items-center justify-center">
                            <CgProfile className="text-black text-[1.7rem] group-hover:text-white" />
                        </div>
                        <p className="text-black text-center text-xs group-hover:text-white">
                            {language === "ar" ? "البيانات" : "Profile"}
                        </p>
                    </NavLink>
                      
                </>
            ) : (
                <NavLink
                    to={"/login"}
                    className="flex flex-col order-1 items-center w-1/5 justify-center hover:cursor-pointer group duration-300 hover:bg-primary h-full"
                >
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className="text-black text-[1.1rem] group-hover:text-white"
                        />
                    </div>
                    <p className="text-black text-center text-xs group-hover:text-white">
                        {language === "ar" ? "تسجيل الدخول" : "Login"}
                    </p>
                </NavLink>
            )}
             <NavLink
                            to={'/wishlist'}
                          className="flex flex-col order-5 items-center w-1/5 justify-center hover:cursor-pointer group duration-300 hover:bg-primary h-full"
                        >
                            <div className="flex items-center justify-center">
                                <FaRegHeart
                                    icon={faRightFromBracket}
                                    className="text-black text-[1.7rem] group-hover:text-white"
                                />
                                <div className="bg-primary flex justify-center items-center rounded text-center w-4 h-4 text-[0.8rem] text-white absolute border border-white bottom-11 left-[11%] shadow-md">
                                <span>{wishList.length}</span>
                                </div>
                            </div>
                            <p className='text-black text-center text-xs group-hover:text-white'>
                                {language === "ar" ? "المفضلة" : "Favorites"}
                            </p>
                        </NavLink>
            {/* Contact Icon */}
            <div className="flex flex-col order-2 items-center w-1/5 justify-center hover:cursor-pointer group duration-300 hover:bg-primary h-full">
                <div className="flex items-center justify-center">
                    <FontAwesomeIcon
                        icon={faPhone}
                        className="text-black group-hover:text-white text-[1.2rem]"
                    />
                </div>
                <p className="text-black text-center text-xs group-hover:text-white">
                    {language === "ar" ? "تواصل معنا" : "Contact"}
                </p>
            </div>

            {/* Cart Icon */}
            <div className="flex flex-col order-3 items-center w-1/5 justify-center hover:cursor-pointer group duration-300 bg-primary h-full">
                <div className="flex items-center justify-center text-xl">
                    <ShoppingCart />
                </div>
                
            </div>

            {/* Language/Home Icon */}
            <Link to={'/home'}
                className="flex flex-col order-4 items-center w-1/5 justify-center hover:cursor-pointer group duration-300 hover:bg-primary h-full"
            >
                <div className="flex items-center justify-center">
                    <IoMdHome className="text-black group-hover:text-white text-[1.3rem]" />
                </div>
                <p className="text-black text-center text-xs group-hover:text-white">
                    {language === "ar" ? "الرئيسية" : "Home"}
                </p>
            </Link>
        </div>
    );
}

export default Menu;
