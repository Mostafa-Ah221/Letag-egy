import { useLocation } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContextPro";
// /payment/status?status=1
export default function Paid() {
  const location = useLocation();
  const { language } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  const status = Number(searchParams.get("status")); 

  if (status === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg shadow-lg bg-white text-center">
          <CheckCircle className="w-[80vw] h-48 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-600 font-arabic">{language=== "ar"? "عملية الدفع تمت بنجاح ":"Payment successful"}</h2>
        </div>
      </div>
    );
  } else if (status === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg shadow-lg bg-white text-center">
          <XCircle className="w-[80vw] h-48 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600 font-arabic">{language=== "ar"? "عمليه الدفع فشلت":"Payment failed"}</h2>
        </div>
      </div>
    );
  }

  return null;
}