import { useState, useContext } from "react";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { FaPlus, FaMinus } from "react-icons/fa";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { HiMinus } from "react-icons/hi2";
export default function FilterProducts() {
  let { subCategories, getBrands } = useContext(ContextData);
  const { language } = useLanguage();

  const [openSections, setOpenSections] = useState({
    brands: false,
    categories: false,
  });

  const [openSubCategories, setOpenSubCategories] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSubCategory = (categoryId) => {
    setOpenSubCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const { data: Categories } = useQuery({
    queryKey: ['subCategory', language],
    queryFn: () => subCategories(language),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 40,
  });

  const { data: Brands } = useQuery({
    queryKey: ["getBrands", language],
    queryFn: () => getBrands(language),
  });

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">تصفية</h2>
      
      {/* العلامات التجارية */}
      <div className="mb-4">
        <h3 className="flex justify-between items-center cursor-pointer text-md font-medium" onClick={() => toggleSection('brands')}>
          <span>العلامات التجارية</span>
          {openSections.brands ? <HiMinus className="text-gray-600  text-2xl" /> : <HiOutlinePlusSmall className="text-gray-600  text-2xl" />}
        </h3>
        {openSections.brands && Brands?.data.brands.map((brand) => (
          <div key={brand.id} className="flex items-center mt-2 ml-4">
            <input type="checkbox" id={`brand-${brand.id}`} value={brand.id} className="mr-2" />
            <label htmlFor={`brand-${brand.id}`} className="text-sm text-gray-700">{brand.name}</label>
          </div>
        ))}
      </div>

      {/* التصنيف */}
      <div>
        <h3 className="flex justify-between items-center cursor-pointer text-md font-medium" onClick={() => toggleSection('categories')}>
          <span>التصنيف</span>
          {openSections.categories ? <HiMinus className="text-gray-600 text-2xl" /> : <HiOutlinePlusSmall className="text-gray-600 text-2xl" />}
        </h3>
        {openSections.categories && Categories?.data.categories.map((category) => (
          <div key={category.id} className="mt-2">
            <div className="flex justify-between items-center cursor-pointer ml-4" onClick={() => toggleSubCategory(category.id)}>
              <div className="flex items-center">
                <input type="checkbox" id={`category-${category.id}`} value={category.id} className="mr-2" />
                <label htmlFor={`category-${category.id}`} className="text-sm text-gray-700">{category.name}</label>
              </div>
              {category.childrenCategories && (
                <span>{openSubCategories[category.id] ? <HiMinus className="text-gray-600  text-2xl" /> : <HiOutlinePlusSmall className="text-gray-600  text-2xl" />}</span>
              )}
            </div>
            {openSubCategories[category.id] && category.childrenCategories?.map((child) => (
              <div key={child.id} className="flex items-center mt-2 ml-8">
                <input type="checkbox" id={`child-category-${child.id}`} value={child.id} className="mr-2" />
                <label htmlFor={`child-category-${child.id}`} className="text-sm text-gray-700">{child.name}</label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
