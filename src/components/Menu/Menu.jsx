import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faBuilding, faEarthAmericas, faPhone } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import { ContextData } from '../../context/ContextApis';
import { CgProfile } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContextPro"; // استيراد اللغة
import { useCart } from '../../context/CartContext';

function Menu() {
    let { userToken, setUserToken } = useContext(ContextData);
    const { language, toggleLanguage } = useLanguage(); // استخدام اللغة وتبديلها
  const {wishList } = useCart(); 

    return (
        <div className="hidden lg:flex bg-Neutral h-[95%] fixed z-50 top-4 flex-col items-center ml-3">
            {/* Cart Icon */}
           <div className="flex flex-col w-full h-14 items-center justify-center hover:cursor-pointer group duration-300 bg-primary ">
                <div className="flex items-center justify-center text-xl">
                    <ShoppingCart />
                </div>
               </div>

            {/* Logout Icon */}
            <div className='flex flex-col items-center mt-24'>
                {userToken !== null ? (
                    <>
                        <NavLink
                            to={'/profile'}
                            className="flex flex-col items-center hover:cursor-pointer my-1 group duration-300 hover:bg-primary w-full p-2"
                        >
                            <div className="flex items-center justify-center">
                                <CgProfile
                                    icon={faRightFromBracket}
                                    className="text-black text-[1.7rem] group-hover:text-white"
                                />
                            </div>
                            <div className='text-black text-right text-[0.8rem] group-hover:text-white'>
                                {language === "ar" ? "البيانات" : "Profile"}
                            </div>
                        </NavLink>
                        <hr className="w-full border-neutral-400 relative bottom-1" />
                        <NavLink
                            to={'/wishlist'}
                            className="hover:cursor-pointer my-1 group duration-300 hover:bg-primary w-full p-2"
                        >
                            <div className="flex items-center justify-center relative">
                                <FaRegHeart
                                    icon={faRightFromBracket}
                                    className="text-black text-[1.5rem] group-hover:text-white"
                                />
                                <div className="bg-primary flex justify-center items-center rounded text-center w-4 h-4 text-[0.8rem] text-white absolute bottom-[0.9rem] border border-white -right-1 shadow-md">
                                <span>{wishList.length}</span>
                                </div>
                            </div>
                            <div className='text-black text-right text-[0.8rem] group-hover:text-white'>
                                {language === "ar" ? "المفضلة" : "Favorites"}
                            </div>
                        </NavLink>
                        <hr className="w-full border-neutral-400 relative bottom-1" />
                    </>
                ) : (
                    <>
                        <NavLink
                            to={'/login'}
                            className="flex flex-col items-center justify-center hover:cursor-pointer my-1 group duration-300 hover:bg-primary w-full p-3"
                        >
                            <FontAwesomeIcon
                                icon={faRightFromBracket}
                                className="text-black text-[1.2rem] group-hover:text-white"
                            />
                            <div className="text-black text-right text-[0.8rem] group-hover:text-white">
                                {language === "ar" ? (
                                    <>
                                        تسجيل<br />
                                        الدخول
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </div>

                        </NavLink>
                    </>
                )}
            </div>

            {/* Main Icons Section */}
            <div className="flex flex-col items-center justify-end flex-grow w-full">
                {/* Togary Icon */}
                <div className="hover:cursor-pointer group duration-300 hover:bg-primary w-full p-2">
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faBuilding}
                            className="text-black text-[1.2rem] group-hover:text-white"
                        />
                    </div>
                    <p className="text-black text-center group-hover:text-white text-xs">
                        {language === "ar" ? "تجاري" : "Business"}
                    </p>
                </div>

                <hr className="w-full border-neutral-400" />

                {/* Language Icon */}
                <div
                    className="mt-2 group hover:cursor-pointer hover:bg-primary w-full p-2"
                    onClick={toggleLanguage} 
                >
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faEarthAmericas}
                            size="xl"
                            className="text-black text-[1.2rem] group-hover:text-white"
                        />
                    </div>
                    <p className="text-black text-center group-hover:text-white text-xs">
                        {language === "ar" ? "EN" : "AR"}
                    </p>
                </div>

                <hr className="w-full border-neutral-400" />

                {/* Contact Us Icon */}
                <div className="mt-2 group hover:cursor-pointer hover:bg-primary p-1 mb-4">
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faPhone}
                            className="text-black text-[1.2rem] group-hover:text-white"
                        />
                    </div>
                    <p className="text-black text-center group-hover:text-white text-[0.8rem] mb-2">
                        {language === "ar" ? "تواصل معنا" : "Contact Us"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Menu;
