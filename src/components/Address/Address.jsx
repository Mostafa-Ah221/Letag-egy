import { useContext } from "react";
import { ContextData } from "../../context/ContextApis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import { MapPin, Building2, Layers } from "lucide-react";

export default function Address({address=true}) {
  const { language } = useLanguage();
    const queryClient = useQueryClient(); 
  const { getAddressList, userToken,deleteAddress,updateAddress } = useContext(ContextData);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getAddressList', language],
    queryFn: () => getAddressList(userToken),
  });
 const handleDelete = async (id) => {
    try {
      await deleteAddress(id, userToken); 
      queryClient.invalidateQueries(["getAddressList", language]);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };
  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <span className="text-lg text-gray-500">
            {language === 'ar' ? 'جاري تحميل العناوين...' : 'Loading addresses...'}
          </span>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-red-50">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-lg text-red-600">
            {language === 'ar' ? 'حدث خطأ أثناء تحميل العناوين' : 'An error occurred while loading addresses'}
          </span>
        </div>
      </div>
    );
  }

  // Empty State
  if (!data?.data.addresses || data.data.addresses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-gray-50">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-lg text-gray-600">
            {language === 'ar' ? 'لا توجد عناوين' : 'No addresses available'}
          </span>
        </div>
      </div>
    );
  }

  // Main Component
  return (
    <>
    {address &&  ( <div className="container mx-auto px-4 py-6 mt-20">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        {language === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses'}
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.addresses.map(address => (
          <div 
            key={address.id} 
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  {address.location_name}
                </h2>
              </div>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-3 text-green-500" />
                  <p>
                    {language === 'ar' ? 'رقم المبنى:' : 'Building Number:'} {' '}
                    <span className="font-medium">{address.building_number}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <Layers className="w-5 h-5 mr-3 text-purple-500" />
                  <p>
                    {language === 'ar' ? 'رقم الطابق:' : 'Floor Number:'} {' '}
                    <span className="font-medium">{address.floor_number}</span>
                   

                  </p>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="truncate">
                    {address.region_name}
                  </p>
                </div>
                <div className="flex justify-between items-center gap-3">
                    <button 
                      className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out" 
                       onClick={() => handleDelete(address.id)} 
                    >
                      {language === 'ar'? 'حذف' : 'Delete'}
                    </button>
  
                    <button 
                      className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out" 
                       
                    >
                      {language === 'ar'? 'Update' : 'تعديل'}
                    </button>
  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>)}
    </>
    
  
  );
}