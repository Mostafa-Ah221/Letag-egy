import { useContext, useEffect, useState } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaHeart } from 'react-icons/fa6';

export default function ProductDetails() {
  const { getProdDetails } = useContext(ContextData);
    const [quantity, setQuantity] = useState(1); 

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');  

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getProdDetails', id],
    queryFn: () => getProdDetails(id),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading product details</div>;

  const section = data?.data?.sections.find(sec => sec.childreen.some(prod => prod.id === parseInt(id)));
  const product = section?.childreen.find(prod => prod.id === parseInt(id));

  return (
    <div className="flex flex-col items-center p-6">
      {product ? (
        <div className="flex flex-row-reverse">
          {/* صورة المنتج */}
          <img className="w-full h-80 object-cover" src={product.photo} alt={product.title} />
          
          <div className="p-6 text-right">
            {/* اسم المنتج وكوده */}
            <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
            
            {/* السعر وتخفيض السعر */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-orange-500">ريال {product.price} </span>
              <span className=" text-gray-400">الكمية المتاحة: {product.stock_qty}</span>
            </div>
            <div className='flex items-center justify-between mb-5 gap-2'>
                <FaHeart className='text-gray-600 text-2xl '/> 
              <button className="px-4 bg-primary w-36 text-white font-bold py-2 rounded hover:bg-orange-600">
                أضف إلى العربة
              </button>
               <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, e.target.value))} 
                    min={1} 
                    className='rounded-md border text-right text-primary border-stone-500 w-28 py-2 px-2'
                  />
            </div>
            <hr />
            <div>
              <h3 className=" mb-4 font-semibold mt-2">:الفئة</h3>
              <p className='text-slate-700'>{product?.category[0]?.name} - {product?.category[1]?.name}</p>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between mt-4">
                <span>منتجات أصلية %100</span>
                <span>توصيل سريع</span>
              </div>
              
            </div>
          </div>
        </div>
      ) : (
        <p>المنتج غير موجود.</p>
      )}
    </div>
  );
}
