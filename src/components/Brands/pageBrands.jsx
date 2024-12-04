import { useContext, useEffect, useState } from "react";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { Link } from "react-router-dom";

export default function PageBrands() {
      const { getBrands } = useContext(ContextData);
      const { language } = useLanguage();
  const [filteredBrands, setFilteredBrands] = useState([]);
   const { data, isLoading, isError } = useQuery({
    queryKey: ["getBrands",language],
    queryFn:()=> getBrands(language),
  });

  useEffect(() => {
    if (data?.data?.brands) {
      const availableBrands = data.data.brands.filter(brand => brand.photo);
      setFilteredBrands(availableBrands);
    }
  }, [data]);
  
 if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className=" px-6 py-4">
        <h2 className="text-2xl text-right mb-7">{language === "ar" ? "العلامات التجارية": "Brands"} </h2>
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4a lg:grid-cols-6 gap-4">  
        {filteredBrands.map((brand) => (
          <Link to={`/categoryFilter/${brand.id}`} key={brand.id} className="flex items-center justify-center px-2 cursor-pointer" state={{ title: brand.name }}>
            <div className="w-28 h-28 my-5 text-center  border border-gray-200 rounded-lg transition-transform duration-300 hover:scale-110 group">
              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  className="w-full h-full object-contain"
                  src={brand.photo}
                  alt={brand.slug}
                  onError={(e) => { e.target.src = "/path/to/placeholder-image.jpg"; }}
                />
              </div>
              <h2 className="mt-2">{brand.slug}</h2>
            </div>
          </Link>
        ))}
      
    </div>
    </div>
     
  )
}
