import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../Loading/LoadingIndicator";
import { useContext } from "react";
import { ContextData } from "../../context/ContextApis";

export default function PageMenu() {
  const { id } = useParams();
  const { api_key } = useContext(ContextData);

  // الدالة لجلب بيانات الصفحة
  const getPageDetails = async (id) => {
    const response = await axios.get(`https://demo.leetag.com/api/page/${id}`,{
      headers:{APP_KEY:api_key}
    });
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getPageDetails', id], 
    queryFn: () => getPageDetails(id),
    enabled: !!id,
  });

  // بيانات الصفحة
  const page = data?.data.page;

   if (isLoading) {
    return (
     <LoadingIndicator />
    );
  }
  if (isError) return <p>Error occurred while fetching data.</p>;

  if (!page) {
    return <div>لا توجد بيانات متاحة لهذه الصفحة.</div>;
  }

  return (
    <div className="p-4 text-right">
      <h2 className="text-2xl font-bold mb-4">{page.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: page.content }} className="leading-relaxed px-20  text-gray-700" />
    </div>
  );
}
