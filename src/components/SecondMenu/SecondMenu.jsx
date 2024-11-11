import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

function SecondMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [childrenCat, setChildrenCat] = useState([]);
    const [image, setImage] = useState();

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

    return (
        <>
            <div className='flex'>
                <button className="block bg-primary w-16 outline-none h-14 right-1  fixed z-30" onClick={handleOpenMenu}>
                    <FontAwesomeIcon icon={isOpen ? faCircleXmark : faBars} className="text-white text-[1.5rem]"  />
                </button>

                <div className={`${isOpen ? "block" : "hidden"}  bg-black bg-opacity-50 w-full h-full fixed z-20`}>
                    <div className="bg-white flex flex-row-reverse w-5/6 rounded-md relative z-10 m-auto mt-5 border-2 border-primary">
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
