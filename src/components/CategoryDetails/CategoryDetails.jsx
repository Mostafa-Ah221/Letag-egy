import { useContext, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IoEyeSharp } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { FaStar } from "react-icons/fa";
import { CiHeart } from 'react-icons/ci';

export default function CategoryDetails() {
  const { getProductCategory } = useContext(ContextData);
  let { id } = useParams();
  const [page, setPage] = useState(0); 
  const pageSize = 30; 

  const { data, isError, isLoading } = useQuery({
    queryKey: ['categoryDetails', id],
    queryFn: () => getProductCategory(id),  
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) return <div>Error loading category details</div>;

  const allProducts = data?.data?.products || [];
  const totalPages = Math.ceil(allProducts.length / pageSize);
  
  const displayedProducts = allProducts.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      <h2 className="text-right my-7 font-semibold text-2xl">{data?.data?.category?.name}</h2>
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
  {/* عمود فارغ في الجهة اليمنى في الشاشات المتوسطة والكبيرة */}

  {displayedProducts.map((subCategory) => (
    <div key={subCategory.id} className="">
      <div className="bg-white group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col p-2">
        <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
          {subCategory.photo && (
            <div className="group h-48 overflow-hidden">
              <img
                src={subCategory?.photo}
                alt={subCategory.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="z-20">
                              <IoEyeSharp className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                            </button>
                            <button className="z-20">
                              <CiHeart className="text-primary  p-2 rounded-full text-[3.8rem]" />
                            </button>
                          </div>
            </div>
          )}
        </div>
        <h3 className='text-right text-sm mt-3 text-slate-800'>{subCategory?.category[0]?.name}</h3>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-right text-lg font-medium mb-2 duration-300 line-clamp-1 min-h-[3.5rem] group-hover:text-primary">
            ...{subCategory.title.split(" ").slice(0, 4).join(" ")}
          </h2>
        </div>
        <div className='flex items-center flex-row-reverse justify-between'>
          <p className='text-xl'>دينار{subCategory.price} </p>
           <p className='text-gray-700'>({subCategory.reviews_count ? subCategory.reviews_count : 0})<FaStar className='text-yellow-500 inline-block'/></p>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* أرقام الصفحات */}
      <div className="flex justify-center mt-6">
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={(selectedItem) => setPage(selectedItem.selected)}
          containerClassName="flex gap-2"
          activeClassName=" text-white bg-primary"
          pageClassName="px-3 py-2 bg-gray-200 rounded"
          previousClassName="hidden"
          nextClassName="hidden"
        />
      </div>
    </div>
  );
}
