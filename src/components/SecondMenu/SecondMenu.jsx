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

                <div className={`${isOpen ? "block" : "hidden"} bg-black bg-opacity-50 w-full h-full fixed z-20 overflow-auto`}>
                    <div className={`h-[100vh] bg-white flex ${language === "ar" ? "flex-row" : "flex-row mx-auto"} w-5/6 rounded-md relative z-10 mt-5 ${
                        language === "ar" ? "right-5" : "-left-20"
                    } border-2 border-primary`}>
                        <div className="flex flex-col bg-white">
                            {categories.map((category) => (
                                <div 
                                    key={category.id} 
                                    className="flex gap-2 bg-white group hover:cursor-pointer w-60 relative z-50" 
                                    onClick={() => handleClick(category.name)}
                                >
                                    <img 
                                        src={category.photo || defaultImage} 
                                        alt={category.name} 
                                        className="w-10 m-1" 
                                    />
                                    <p className="hover:text-primary my-2">{category.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="h-50px w-0.5 opacity-40 bg-black mx-4 border-l-2"></div>
                        <div className="flex flex-col">
                            {childrenCat.map((child) => (
                                <Link 
                                    to={`/categoryDetails/${child.id}`}
                                    onClick={() => { 
                                        setSelectedCategoryId(child.id)
                                        setIsOpen(false)
                                    }}
                                    key={child.id}
                                >
                                    <div className="flex bg-white group hover:cursor-pointer w-60 z-50">
                                        <p className="text-black group-hover:text-primary my-2">
                                            {child.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className={`w-60 h-60 mt-2 ${
                            language === "ar" ? "absolute left-0 ml-48" : "absolute right-0 mr-48"
                        }`}>
                            <img src={image} alt="Selected category" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SecondMenu