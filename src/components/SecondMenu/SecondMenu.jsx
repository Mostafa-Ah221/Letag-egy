import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function SecondMenu() {
     const { subCategories } = useContext(ContextData);
    const [filteredCategory, setFilteredCategory] = useState([]);

//   const sliderRef = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subCategory'],
    queryFn: subCategories
  });

  useEffect(()=>{
    if(data?.data.categories){
        const availableCategor= data?.data.categories.filter(category => category.photo)
        setFilteredCategory(availableCategor)
    }
  },[data])
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [childrenCat, setChildrenCat] = useState([]);
    const [image, setImage] = useState();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); 

    // Toggle Menu State
    const handleOpenMenu = () => setIsOpen(prevState => !prevState);

    // Fetch categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://tarshulah.com/api/categories");
                const data = await response.json();
                setCategories(data.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
    }, []);

    // Handle category click and fetch child categories
    const handleClick = (categoryName) => {
        const selectedCategory = categories.find(cat => cat.name === categoryName);
        setChildrenCat(selectedCategory ? selectedCategory.childrenCategories : []);
        setImage(selectedCategory.photo);
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

        // Cleanup function to reset scroll on component unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <>
            <div className='flex relative z-50'>
                <div className='flex flex-row-reverse'> 
                <button className="block bg-primary w-16 outline-none h-14 mr-3 ml-auto  z-30" onClick={handleOpenMenu}>
                    <FontAwesomeIcon icon={isOpen ? faCircleXmark : faBars} className="text-white text-[1.5rem]" />
                </button>
               {filteredCategory.slice(0, 10).map((category) => (
                <div key={category.id} className='w-28'>
                    <Link to={`/categoryDetails/${category.id}`} onClick={() => setSelectedCategoryId(category.id)}>
                        <div 
                            className={`overflow-hidden bg-white shadow-sm rounded- hover:shadow-md transition-all duration-300 ${
                                selectedCategoryId === category.id ? 'border-2 border-primary' : ""
                            }`}
                        >
                            <img 
                                className='h-7 w-full object-contain transform transition-all duration-300 group-hover:scale-110' 
                                src={category.photo} 
                                alt={category.name} 
                                loading="lazy"
                            />
                            <h3 className='text-center py-2 text-[0.7rem] font-medium text-secondary group-hover:text-orange-500 transition-all duration-300'>
                                {category.name.split(" ").slice(0, 2).join(' ')}
                            </h3>
                        </div>
                    </Link>
                </div>
            ))}

                </div>

                <div className={`${isOpen ? "block" : "hidden"} bg-black bg-opacity-50 w-full h-full fixed z-20 overflow-auto`}>
                    <div className="bg-white flex flex-row-reverse w-5/6 rounded-md relative z-10 m-auto mt-5 ml-11 border-2 border-primary">
                        <div className="flex flex-col bg-white">
                            {categories.map((category) => (
                                <div key={category.id} className="flex bg-white group hover:cursor-pointer w-60 relative z-50" onClick={() => handleClick(category.name)}>
                                    <p className="text-black hover:text-primary my-2">{category.name}</p>
                                    <img src={category.photo} alt={category.name} className="absolute right-0 w-10" />
                                </div>
                            ))}
                        </div>
                        <div className="h-50px w-0.5 opacity-40 bg-black mx-4 border-l-2"></div>
                        <div className="flex flex-col">
                            {childrenCat.map((child) => (
                                <div key={child.id} className="flex bg-white group hover:cursor-pointer w-60 z-50">
                                    <p className="text-black group-hover:text-primary my-2">{child.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className='w-60 h-60 absolute left-0 ml-48'>
                            <img src={image} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SecondMenu;
