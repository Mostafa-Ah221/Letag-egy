import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

function SecondMenu() {
    let orangeColor = "primary";
    let whiteColor = "white";
    let blackColor = "black";
    const [isOpen, setIsOpen] = useState(false);
    var resData;
    const [categories, setCategories] = useState([]);
    const [childrenCat, setChildrenCat] = useState([]);
    const handleOpenMenu = () => {
        isOpen ? setIsOpen(false) : setIsOpen(true);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://tarshulah.com/api/categories");
                resData = await res.json();
                const rescategories = await resData.data.categories;
                setCategories(rescategories);
                console.log(rescategories);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    const handleClick = async (e) => {
        try {
            const res = await fetch("https://tarshulah.com/api/categories");
            resData = await res.json();
            const rescategories = await resData.data.categories;
            const text = await e.target.textContent;
            let childrenCategory = [];
            for (let cat of rescategories) {
                if (cat.name == text) {
                    childrenCategory = cat.childrenCategories;
                }
            }
            setChildrenCat(childrenCategory);
            console.log(childrenCat);
            console.log(text);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            {/*Main div*/}
            {/*Menu div*/}
            {/* <button className='bg-orange w-24 h-full rounded-md' onClick={handleOpenMenu}>{isOpen ? <FontAwesomeIcon icon={faCircleXmark} className='text-white' size='xl' /> : <FontAwesomeIcon icon={faBars} className='text-white' size='xl' />}</button> */}
            <button className={`block bg-${orangeColor} w-24 h-12 rounded-md h-14 float-right`} onClick={handleOpenMenu}><FontAwesomeIcon icon={isOpen ? faCircleXmark : faBars} className='text-white' size='xl' /></button>
            <div className={`${isOpen ? "block" : "hidden"} bg-${blackColor} opacity-50 w-full h-full fixed z-40`}>
                <div className={`bg-${whiteColor} flex flex-row-reverse ${isOpen ? "block" : "hidden"} w-5/6 rounded-md relative z-50`}>
                    <div className={`flex flex-col bg-${whiteColor}`}>
                        {categories.map((category) => (
                            <>
                                <div className={`flex bg-${whiteColor} group hover:cursor-pointer w-60 relative z-50`} key={category.id} onClick={handleClick}>
                                    <p className={`text-${blackColor} hover:text-${orangeColor} my-2`}>{category.name}</p>
                                    <img src={category.photo} alt={category.name} className='size-10 absolute right-0' />
                                </div>
                                <hr></hr>
                            </>
                        ))}
                    </div>
                    <div className={`h-50px w-0.5 opacity-40 bg-${blackColor} mx-4 border-l-2`}></div>
                    <div className={`flex flex-col z-50`}>
                        {childrenCat.map((category) => (
                            <>
                                <div className={`flex bg-${whiteColor} group hover:cursor-pointer w-60 z-50`} key={category.id}>
                                    <p className={`text-${blackColor} group-hover:text-${orangeColor} my-2`}>{category.name}</p>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SecondMenu
