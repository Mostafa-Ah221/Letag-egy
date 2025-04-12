import { useState, useContext } from "react";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { HiOutlinePlusSmall, HiMinus } from "react-icons/hi2";

export default function FilterProducts({ onFilterChange }) {
  const { subCategories, getBrands,cityData } = useContext(ContextData);
  const { language } = useLanguage();

  const [openSections, setOpenSections] = useState({
    brands: false,
    categories: false,
  });

  const [openSubCategories, setOpenSubCategories] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    brands_id: [],
    categories_id: [],
  });

  const { data: Categories } = useQuery({
    queryKey: ['subCategory', language,cityData],
    queryFn: () => subCategories(language),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  const { data: Brands } = useQuery({
    queryKey: ["getBrands", language],
    queryFn: () => getBrands(language),
  });
const handleFilterChange = (type, id) => {
  const newFilters = {
    ...selectedFilters,
    [type]: selectedFilters[type].includes(id)
      ? selectedFilters[type].filter(item => item !== id)
      : [...selectedFilters[type], id]
  };
  
  setSelectedFilters(newFilters);
  
  // إضافة cityData إلى الفلاتر إذا كانت متاحة
  if (cityData) {
    onFilterChange({
      ...newFilters,
      city_id: cityData
    });
  } else {
    onFilterChange(newFilters);
  }
};

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSubCategory = (categoryId) => {
    setOpenSubCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };
  const defaultImage = "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";

  return (
    <div className="p-4 bg-white shadow rounded max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">{language === "ar"? "تصفية":"Filters"}</h2>
      
      <div>
        <h3 className="flex justify-between items-center cursor-pointer text-md font-medium" 
            onClick={() => toggleSection('categories')}>
          <span>{language ==="ar"? "الفئات":"Categories"}</span>
          {openSections.categories ? 
            <HiMinus className="text-gray-600 text-2xl" /> : 
            <HiOutlinePlusSmall className="text-gray-600 text-2xl" />}
        </h3>
        {openSections.categories && (
          <div className=" ">
            {Categories?.data.categories.map((category) => (
              <div key={category.id} className="mt-2">
                <div className="flex justify-between items-center cursor-pointer ">
                  <div className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      id={`category-${category.id}`} 
                      value={category.id}
                      checked={selectedFilters.categories_id.includes(category.id)}
                      onChange={() => handleFilterChange('categories_id', category.id)}
                      className="mr-2 accent-primary" 
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>
                  {category.childrenCategories && (
                    <span onClick={() => toggleSubCategory(category.id)}>
                      {openSubCategories[category.id] ? 
                        <HiMinus className="text-gray-600 text-2xl" /> : 
                        <HiOutlinePlusSmall className="text-gray-600 text-2xl" />}
                    </span>
                  )}
                </div>
                {openSubCategories[category.id] && (
                  <div className={`${language === 'ar'? "mr-2": "ml-2"}  `}>
                    {category.childrenCategories.map((child) => (
                      <div key={child.id} className="flex items-center mt-2 gap-1">
                        <input 
                          type="checkbox" 
                          id={`child-category-${child.id}`} 
                          value={child.id}
                          checked={selectedFilters.categories_id.includes(child.id)}
                          onChange={() => handleFilterChange('categories_id', child.id)}
                          className="mr-2 accent-primary" 
                        />
                        <label htmlFor={`child-category-${child.id}`} className="text-sm text-gray-700">
                          {child.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
        <div className="mb-4">
        <h3 className="flex justify-between items-center cursor-pointer text-md font-medium" 
            onClick={() => toggleSection('brands')}>
          <span>{language ==="ar"? "العلامات التجارية":"Brandes"}</span>
          {openSections.brands ? 
            <HiMinus className="text-gray-600 text-2xl" /> : 
            <HiOutlinePlusSmall className="text-gray-600 text-2xl" />}
        </h3>
        {openSections.brands && (
          <div className="">
            {Brands?.data.brands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-1 mt-2 ml-4">
                <input 
                  type="checkbox" 
                  id={`brand-${brand.id}`} 
                  value={brand.id}
                  checked={selectedFilters.brands_id.includes(brand.id)}
                  onChange={() => handleFilterChange('brands_id', brand.id)}
                  className="mr-2 accent-primary" 
                />
                <label htmlFor={`brand-${brand.id}`} className="text-sm text-gray-700">
                  {language  === "ar"?`${brand.name}`: `${brand.slug}`}
                 
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
