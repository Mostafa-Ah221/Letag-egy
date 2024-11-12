import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faBuilding, faEarthAmericas, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ShoppingCart from '../ShoppingCart/ShoppingCart';

function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="hidden lg:flex bg-Neutral h-[95%]  fixed z-50 top-4 flex-col items-center ml-3">
            {/* Cart Icon */}
            <ShoppingCart />

            {/* Logout Icon */}
            <div className="my-24 hover:cursor-pointer group duration-300 hover:bg-primary p-3 w-full">
                <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-black text-[1.2rem] group-hover:text-white" />
                </div>
                <Link to={'/login'} className="text-black text-right text-[0.8rem] group-hover:text-white">تسجيل <br/>الدخول</Link>
            </div>

            {/* Main Icons Section */}
            <div className="flex flex-col items-center justify-end flex-grow w-full">
                {/* Togary Icon */}
                <div className="hover:cursor-pointer group duration-300 hover:bg-primary w-full p-2">
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faBuilding} className="text-black text-[1.2rem] group-hover:text-white" />
                    </div>
                    <p className="text-black text-center group-hover:text-white text-xs">تجارى</p>
                </div>

                <hr className="w-full border-neutral-400" />

                {/* Language Icon */}
                <div className="mt-2 group hover:cursor-pointer hover:bg-primary w-full p-2">
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faEarthAmericas} size="xl" className="text-black text-[1.2rem] group-hover:text-white" />
                    </div>
                    <p className="text-black text-center group-hover:text-white text-xs">EN</p>
                </div>

                <hr className="w-full border-neutral-400" />

                {/* Contact Us Icon */}
                <div className="mt-2 group hover:cursor-pointer hover:bg-primary p-1 mb-4">
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faPhone} className="text-black text-[1.2rem] group-hover:text-white" />
                    </div>
                    <p className="text-black text-center group-hover:text-white text-[0.8rem] mb-2">تواصل معنا</p>
                </div>
            </div>
        </div>
    );
}

export default Menu;
