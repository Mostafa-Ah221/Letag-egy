import { useContext } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IoEyeSharp } from "react-icons/io5";


export default function CategoryDetails() {
  const { getCategoriesDetails } = useContext(ContextData);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');  

  const { data, isError, isLoading } = useQuery({
    queryKey: ['categoryDetails', id],
    queryFn: () => getCategoriesDetails(id),  
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading category details</div>;

  const category = data?.data?.categories.find(cat => cat.id === parseInt(id)); 

  return (
    <div>
      <h2 className='text-right my-7 font-semibold text-2xl'>{category?.name}</h2>
      <div className='flex flex-row-reverse justify-around items-center'>
        <div className='w-1/3 p-4'>
            <img src={category.photo} className='w-full h-auto rounded-lg' alt="" />
        </div>
        {category?.childrenCategories?.map((subCategory) => (
           <div key={subCategory.id} className="product-item flex flex-col h-full">
              <div className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                  {subCategory.photo && (
                    <div className="group h-48 overflow-hidden">
                      <img
                        src={subCategory.photo}
                        alt={subCategory.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-right text-lg font-medium mb-2 duration-300 line-clamp-2 min-h-[3.5rem] group-hover:text-primary">
                    {subCategory.name}
                  </h3>
                 
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
