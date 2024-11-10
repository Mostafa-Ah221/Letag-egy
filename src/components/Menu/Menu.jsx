import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faRightFromBracket, faBuilding, faEarthAmericas, faPhone, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
function Menu() {
    const orangeColor = "orange";
    const grayColor = "gray";
    const whiteColor = "white";
    const blackColor = "black";
    const [isOpen, setIsOpen] = useState(false);
    const handleOpenMenu = () => {
        isOpen ? setIsOpen(false) : setIsOpen(true);
    };
    return (
        <>
            {/*arrow menu*/}
            <button className={`rounded-full bg-${grayColor} group hover:bg-orange hover:cursor-pointer w-6 h-6 flex items-center justify-center fixed left-0 top-0 my-80 ${isOpen ? "mx-28" : "mx-0"}`} onClick={handleOpenMenu}>
                {isOpen ? <FontAwesomeIcon icon={faArrowLeft} size='lg' className={`text-${blackColor} group-hover:text-${whiteColor}`} /> : <FontAwesomeIcon icon={faArrowRight} size='lg' className={`text-${blackColor} group-hover:text-${whiteColor}`} />}
            </button>
            {/*Main div*/}
            <div className={`bg-${grayColor} h-3/4 my-24 mx-2 fixed left-0 top-0 rounded-md w-24 ${isOpen ? "block" : "hidden"}`}>
                {/*cart div*/}
                <div className={`bg-${orangeColor} flex items-center justify-center rounded-md h-20 hover:cursor-pointer`}>
                    <FontAwesomeIcon icon={faCartShopping} className={`text-${whiteColor} py-2`} size='xl' />
                </div>
                {/*logout div*/}
                <div className={`bg-${grayColor} my-24 rounded-md hover:cursor-pointer group hover:bg-${orangeColor}`}>
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faRightFromBracket} size='xl' className={`text-${blackColor} group-hover:text-${whiteColor}`} />
                    </div>
                    <p className={`text-${blackColor} text-center group-hover:text-${whiteColor}`}>تسجيل الخروج</p>
                </div>
                {/*Togary div*/}
                <div className={`bg-${grayColor} rounded-md group hover:cursor-pointer hover:bg-${orangeColor}`}>
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faBuilding} size='xl' className={`text-${blackColor} group-hover:text-${whiteColor}`} />
                    </div>
                    <p className={`text-${blackColor} text-center group-hover:text-${whiteColor}`}>تجارى</p>
                </div>
                <hr />
                {/*Language div*/}
                <div className={`bg-${grayColor} my-1 rounded-md group hover:cursor-pointer hover:bg-${orangeColor}`}>
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faEarthAmericas} size='xl' className={`text-${blackColor} group-hover:text-${whiteColor}`} />
                    </div>
                    <p className={`text-${blackColor} text-center group-hover:text-${whiteColor}`}>EN</p>
                </div>
                <hr />
                {/*Contact-Us div*/}
                <div className={`bg-${grayColor} mt-1 rounded-md group hover:cursor-pointer hover:bg-${orangeColor}`}>
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faPhone} size='xl' className={`text-${blackColor} group-hover:text-${whiteColor}`} />
                    </div>
                    <p className={`text-${blackColor} text-center group-hover:text-${whiteColor}`}>تواصل معنا</p>
                </div>
            </div>
        </>
    )
}

export default Menu
