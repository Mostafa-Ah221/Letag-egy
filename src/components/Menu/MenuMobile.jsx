import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faRightFromBracket, faBuilding, faEarthAmericas, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ShoppingCart from '../ShoppingCart/ShoppingCart';

function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpenMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="lg:hidden rounded-tr-2xl rounded-tl-2xl bg-Neutral z-[60] flex w-full justify-between items-center fixed bottom-0 px-3 h-fit">
            {/* Cart Icon */}
            <div className="bg-primary order-3 h-16 text-xl flex items-center">
                 <ShoppingCart/>
            </div>
            
            {/* Logout Icon */}
            <div className="order-1 hover:cursor-pointer group duration-300 hover:bg-primary w-12 h-16 pl-1">
                <div className="flex items-center justify-center ">
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-black text-[1.1rem] group-hover:text-white" />
                </div>
                <Link to={'/login'} className="text-black text-[0.7rem]  group-hover:text-white">تسجيل الدخول</Link>
            </div>
            
            {/* Togary Icon */}
            <div className="order-2 hover:cursor-pointer group duration-300 hover:bg-primary w-12 h-16 pl-1 flex flex-col justify-evenly">
                <div className="flex items-center justify-center ">
                    <FontAwesomeIcon icon={faBuilding} className="text-black text-[1.3rem] group-hover:text-white" />
                </div>
                <p className="text-black text-center group-hover:text-white text-xs">تجارى</p>
            </div>
            
            
            {/* Language Icon */}
            <div className="order-4 hover:cursor-pointer group duration-300 hover:bg-primary w-12 h-16 pl-1 flex flex-col justify-evenly">
                <div className="flex items-center justify-center h-full">
                    <FontAwesomeIcon icon={faEarthAmericas}  className="text-black group-hover:text-white text-[1.3rem] " />
                </div>
                <p className="text-black text-center group-hover:text-white text-xs">EN</p>
            </div>
            
            
            {/* Contact Us Icon */}
            <div className="order-5 hover:cursor-pointer group duration-300 hover:bg-primary w-12 h-16 pl-1 flex flex-col justify-evenly">
                <div className="flex items-center justify-center h-full">
                    <FontAwesomeIcon icon={faPhone}  className="text-black group-hover:text-white text-[1.2rem] " />
                </div>
                <p className="text-black text-center group-hover:text-white text-xs ">تواصل معنا</p>
            </div>
        </div>
    );
}

export default Menu;
