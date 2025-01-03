import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { ContextData } from '../../context/ContextApis'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContextPro'

function SecondMenu() {
    const { subCategories } = useContext(ContextData)
    const { language } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [childrenCat, setChildrenCat] = useState([])
    const [image, setImage] = useState()
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [categories, setCategories] = useState([])
    const [filteredCategory, setFilteredCategory] = useState([])

  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

    const { data, isLoading, isError } = useQuery({
        queryKey: ['subCategory', language],
        queryFn: subCategories,
        staleTime: 1000 * 60 * 30,
        cacheTime: 1000 * 60 * 40,
    })

    const handleOpenMenu = () => setIsOpen(prevState => !prevState)

    const handleClick = (categoryName) => {
        const selectedCategory = categories.find(cat => cat.name === categoryName)
        setChildrenCat(selectedCategory ? selectedCategory.childrenCategories : [])
        setImage(selectedCategory?.photo || defaultImage)
    }

    useEffect(() => {
        if (isOpen) {
            document.documentElement.style.overflow = 'hidden'
            document.documentElement.style.height = '100%'
        } else {
            document.documentElement.style.overflow = 'auto'
            document.documentElement.style.height = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    useEffect(() => {
        if (data?.data.categories) {
            setFilteredCategory(data.data.categories)
            setCategories(data.data.categories)
            setImage(data.data.categories[0]?.photo || defaultImage)
        }
    }, [data, language])

    // حساب عرض العنصر الواحد بناءً على عدد العناصر
    const calculateItemWidth = () => {
        const totalCategories = filteredCategory.length
        if (totalCategories === 0) return 'w-0'
        if (totalCategories <= 10) {
            // تقسيم العرض الكامل على عدد العناصر
            const percentage = (100 / totalCategories).toFixed(2)
            return `w-[${percentage}%]`
        }
        // إذا كان العدد أكبر من 13، نستخدم العرض الثابت
        return 'w-[7.1rem]'
    }

    // تحديد العناصر التي سيتم عرضها
    const displayedCategories = filteredCategory.slice(0, Math.min(filteredCategory.length, 12))

    return (
        <>
            <div className='relative hidden lg:flex bg-Neutral'>
                <div className='flex flex-row-reverse overflow-hidden w-full'>
                    <button 
                        className={`absolute ${language === "ar" ? "left-0" : "right-0"} bg-primary w-16 outline-none h-[3.6rem] ml-auto z-30`} 
                        onClick={handleOpenMenu}
                    >
                        <FontAwesomeIcon 
                            icon={isOpen ? faCircleXmark : faBars} 
                            className="text-white text-[1.5rem]" 
                        />
                    </button>
                    <div className='bg-white flex w-full justify-around'>
                        {displayedCategories.map((category) => (
                            <div 
                                key={category.id} 
                                className={calculateItemWidth()}
                            >
                                <Link 
                                    to={`/categoryDetails/${category.id}`} 
                                    onClick={() => setSelectedCategoryId(category.id)}
                                >
                                    <div className={`w-full px-2 mx-2 bg-white shadow-sm rounded hover:shadow-md transition-all duration-300 ${
                                        selectedCategoryId === category.id ? 'border-2 border-primary' : ''
                                    }`}>
                                        <img 
                                            className='h-7 w-full object-contain transform transition-all duration-300 group-hover:scale-110' 
                                            src={category.photo || defaultImage} 
                                            alt={category.name} 
                                            loading="lazy" 
                                        />
                                        <h3 className='line-clamp-1 py-2 text-[0.6rem] text-center font-medium text-secondary group-hover:text-primary transition-all duration-300'>
                                            {category.name.split(" ").slice(0, 2).join(' ')}
                                        </h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`${isOpen ? "block" : "hidden"} bg-black bg-opacity-50 w-full h-full fixed z-20 overflow-hidden`}>
                <div className={`h-[90vh] bg-white flex ${language === "ar" ? "flex-row" : "flex-row mx-auto"} w-5/6 rounded-lg relative z-10 my-5 ${
                    language === "ar" ? "right-5" : "-left-20"
                } border-2 border-primary shadow-2xl`}>
                    <div className="flex flex-col bg-white p-4 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                        {categories.map((category) => (
                            <div 
                                key={category.id} 
                                className="flex gap-3 bg-white group hover:bg-gray-50 hover:cursor-pointer p-3 rounded-md transition-all duration-200" 
                                onClick={() => handleClick(category.name)}
                            >
                                <img 
                                    src={category.photo || defaultImage} 
                                    alt={category.name} 
                                    className="w-12 h-12 object-cover rounded-md" 
                                />
                                <p className="hover:text-primary my-auto font-medium">{category.name}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="h-auto w-0.5 bg-gray-200 mx-6"></div>
                    
                    <div className="flex flex-col p-4 overflow-y-auto max-h-[90vh]">
                        {childrenCat.map((child) => (
                            <Link 
                                to={`/categoryDetails/${child.id}`}
                                onClick={() => { 
                                    setSelectedCategoryId(child.id)
                                    setIsOpen(false)
                                }}
                                key={child.id}
                            >
                                <div className="hover:bg-gray-50 p-3 rounded-md transition-all duration-200">
                                    <p className="text-gray-700 hover:text-primary">
                                        {child.name}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className={`w-72 h-72 mt-4 p-4 ${
                        language === "ar" ? "absolute left-11 " : "absolute right-11 "
                    }`}>
                        <img src={image} alt="Selected category" className="w-full h-full object-cover rounded-lg shadow-lg" />
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default SecondMenu