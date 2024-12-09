import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PageMenu() {
  const { id } = useParams();

  // الدالة لجلب بيانات الصفحة
  const getPageDetails = async (id) => {
    const response = await axios.get(`https://demo.leetag.com/api/page/${id}`);
    return response.data;
  };

  // استخدام React Query لجلب البيانات
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getPageDetails', id], // إضافة `id` كـ جزء من المفتاح
    queryFn: () => getPageDetails(id),
    enabled: !!id, // التأكد من وجود `id` قبل الجلب
  });

  // بيانات الصفحة
  const page = data?.data.page;

   if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
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
