import { useContext, useEffect, useState } from "react";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";

export default function PageBrands() {
      const { getBrands } = useContext(ContextData);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getBrands"],
    queryFn: getBrands,
  });

  useEffect(() => {
    if (data?.data?.brands) {
      const availableBrands = data.data.brands.filter(brand => brand.photo);
      setFilteredBrands(availableBrands);
    }
  }, [data]);
  return (
    <div className=" px-6 py-4">
        <h2 className="text-2xl text-right mb-7">العلامات التجارية</h2>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">  
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="flex items-center justify-center px-2 cursor-pointer">
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
          </div>
        ))}
      
    </div>
    </div>
     
  )
}
