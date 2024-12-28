import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContextPro';

function SecondMenu() {
    const { subCategories } = useContext(ContextData);
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [childrenCat, setChildrenCat] = useState([]);
    const [image, setImage] = useState();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filteredCategory, setFilteredCategory] = useState([]);

    // تحديد الصورة الافتراضية
    const defaultImage = "https://via.placeholder.com/150";  

    const { data, isLoading, isError } = useQuery({
        queryKey: ['subCategory', language],
        queryFn: subCategories,
        staleTime: 1000 * 60 * 30,
        cacheTime: 1000 * 60 * 40,
    });

    // Toggle Menu State
    const handleOpenMenu = () => setIsOpen(prevState => !prevState);

    // Handle category click and fetch child categories
    const handleClick = (categoryName) => {
        const selectedCategory = categories.find(cat => cat.name === categoryName);
        setChildrenCat(selectedCategory ? selectedCategory.childrenCategories : []);
        setImage(selectedCategory?.photo || defaultImage);  // تعيين الصورة الافتراضية إذا لم تكن هناك صورة
    };

    // Effect to disable scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.documentElement.style.overflow = 'hidden'; // Disable scroll on html element
            document.documentElement.style.height = '100%';      // Prevent any overflow in height
        } else {
            document.documentElement.style.overflow = 'auto';    // Enable scroll back
            document.documentElement.style.height = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto'; // Cleanup
        };
    }, [isOpen]);

    useEffect(() => {
        if (data?.data.categories) {
            setFilteredCategory(data?.data.categories); // لا حاجة لتصفية الفئات
            setCategories(data?.data.categories);
            setImage(data?.data.categories[0]?.photo || defaultImage);  // تعيين الصورة الأولى كصورة افتراضية عند فتح الـ menu
        }
    }, [data, language]);

    return (
        <>
            <div className=' relative hidden lg:flex bg-Neutral'>
                <div className='flex flex-row-reverse overflow-hidden'>
                    <button className={`absolute ${language === "ar" ? "left-0":"right-0"} bg-primary w-16 outline-none h-[3.8rem] ml-auto z-30`} onClick={handleOpenMenu}>
                        <FontAwesomeIcon icon={isOpen ? faCircleXmark : faBars} className="text-white text-[1.5rem]" />
                    </button>
                    <div className='bg-white flex'>
                    {filteredCategory.slice(0, 10).map((category) => (
                        <div key={category.id} className='w-[7.1rem] overflow-hidden'>
                            <Link to={`/categoryDetails/${category.id}`} onClick={() => setSelectedCategoryId(category.id)}>
                                <div className={`overflow-hidden mx-2 bg-white shadow-sm rounded hover:shadow-md transition-all duration-300 ${selectedCategoryId === category.id ? 'border-2 border-primary' : ""}`}
                                >
                                    <img className='h-7 w-full object-contain transform transition-all duration-300 group-hover:scale-110' 
                                         src={category.photo || defaultImage} 
                                         alt={category.name} loading="lazy" />
                                    <h3 className=' line-clamp-1  py-2 text-[0.6rem] text-center font-medium text-secondary group-hover:text-primary transition-all duration-300'>
                                        {category.name.split(" ").slice(0, 2).join(' ')}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}

                    </div>
                </div>
                <div className={`${isOpen ? "block" : "hidden"} bg-black bg-opacity-50 w-full h-full fixed z-20 overflow-auto`}>
                    <div className={`bg-white flex ${language === "ar" ? "flex-row" : "flex-row mx-auto"} w-5/6 rounded-md relative z-10  mt-5 ${language === "ar"?"right-5" :"-left-20"} border-2 border-primary`}>
                        <div className="flex flex-col bg-white">
                            {categories.map((category) => (
                                <div key={category.id} className="flex gap-2 bg-white group hover:cursor-pointer w-60 relative z-50" onClick={() => handleClick(category.name)}>
                                     <img src={category.photo || defaultImage} alt={category.name} className={` w-10`} />
                                    <p className={` hover:text-primary my-2 `}>{category.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="h-50px w-0.5 opacity-40 bg-black mx-4 border-l-2"></div>
                        <div className="flex flex-col">
                            {childrenCat.map((child) => (
                                <Link to={`/categoryDetails/${child.id}`}
                                 onClick={() => { setSelectedCategoryId(child.id); setIsOpen(false); }}
                                 key={child.id}>
                                    <div className="flex bg-white group hover:cursor-pointer w-60 z-50">
                                        <p className="text-black group-hover:text-primary my-2">{child.name}</p>
                                    </div>
                                 </Link>
                            ))}
                        </div>
                        <div className={`w-60 h-60 ${language === "ar" ? "absolute left-0" : "absolute right-0"} ml-48`}>
                            <img src={image} alt="Selected category" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SecondMenu;
