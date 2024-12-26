import { User, Mail, Lock, Save } from 'lucide-react';
import { useLanguage } from "../../context/LanguageContextPro"; 

export default function UpdateProfile() {
  const { language } = useLanguage(); 

  return (
    <div className="min-h-screen ">
      <div className=" bg-white rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="p-6 border-b ">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {language === "ar" ? "تحديث الملف الشخصي" : "Update Profile"}
          </h2>
          <p className="mt-2 text-center text-gray-500">
            {language === "ar" ? "قم بتحديث معلوماتك الشخصية وكلمة المرور" : "Update your personal information and password"}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form className="">
            {/* Basic Information Section */}
            <div className="">
              <div className="flex items-center gap-4 w-full">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  {language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
                </h3>
              </div>
              
              <div className="grid gap-4">
                <div className="">
                  <label htmlFor="name" className="text-right block text-sm font-medium text-gray-700">
                    {language === "ar" ? "الاسم" : "Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                    className="w-full text-right px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="">
                  <label htmlFor="email" className="text-right block text-sm font-medium text-gray-700">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder=""
                      className="w-full text-right px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-200 my-6"></div>

            {/* Password Section */}
            <div className="">
              <div className="flex items-center gap-4">
                <Lock className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  {language === "ar" ? "تغيير كلمة المرور" : "Change Password"}
                </h3>
              </div>

              <div className="grid gap-4">
               
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="">
                    <label htmlFor="new-password" className=" block text-sm font-medium text-gray-700">
                      {language === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="w-full text-right px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder=""
                    />
                  </div>

                  <div className="">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full bg-primary text-white py-2 px-4 rounded-lg h-11 text-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
