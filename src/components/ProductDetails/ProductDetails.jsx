import { useContext } from 'react';
import { ContextData } from '../../context/ContextApis';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';


export default function ProductDetails() {
  const { getProdDetails } = useContext(ContextData);
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
        <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
          <img className="w-full h-48 object-cover" src={product.photo} alt={product.title} />
          <div className="p-4 text-right">
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4">{product.category.map(cat => cat.name).join(', ')}</p>
            <p className="text-gray-800 font-semibold">السعر: {product.price} ريال</p>
          </div>
        </div>
      ) : (
        <p>المنتج غير موجود.</p>
      )}
    </div>
  );
}
