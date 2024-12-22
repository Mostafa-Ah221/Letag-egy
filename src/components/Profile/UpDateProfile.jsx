import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContextPro';
import { ContextData } from "../../context/ContextApis";

export default function UpdateProfile() {
  const [NameError, setNameError] = useState(false);
  const [EmailError, setEmailError] = useState(false);
  const [PassError, setPassError] = useState(false);
  const [user, setUser] = useState({});
  const { userData } = useContext(ContextData);
  const { language } = useLanguage();
  const isValid = (pattern, text) => {
    return new RegExp(pattern).test(text);
  };
  const handleNameChange = (e) => {
    const userName = e.target.value;
    if (userName.length <= 3) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    const valid = isValid("/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/", email);
    if (email.length != 0) {
      if (valid) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
  };
  const handlePassChange = (e) => {
    const pass = e.target.value;
    if (pass.length == 0) {
      setPassError(true);
    } else {
      setPassError(false);
    }
  };
  const handleSaveClick = () => {

  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await userData;
      setUser(data);
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            تحديث الملف الشخصي
          </h2>
          <p className="mt-2 text-center text-gray-500">
            قم بتحديث معلوماتك الشخصية وكلمة المرور
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">المعلومات الأساسية</h3>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-right block text-sm font-medium text-gray-700">
                    الاسم <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    placeholder="أدخل اسمك الكامل"
                    className="w-full text-right px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    onChange={() => handleNameChange(event)}
                    defaultValue={user.name}
                  />
                  {NameError ? <p className='my-2 text-red'>{language === "ar" ? "من فضلك لا يقل الاسم عن 3 عناصر" : "Please Name must be more than 3 characters"}</p> : <></>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-right block text-sm font-medium text-gray-700">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder=""
                      className="w-full text-right px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      onChange={() => handleEmailChange(event)}
                      defaultValue={user.email}
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {EmailError ? <p className='my-2 text-red'>{language === "ar" ? "البريد الالكترونى خاطئ" : "Wrong Email"}</p> : <></>}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-200 my-6"></div>

            {/* Password Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Lock className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">تغيير كلمة المرور</h3>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className=" block text-sm font-medium text-gray-700">
                    كلمة المرور الحالية
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="w-full  px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder=""
                    disabled
                    onChange={() => handlePassChange(event)}
                    defaultValue={user.pass}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className=" block text-sm font-medium text-gray-700">
                      كلمة المرور الجديدة
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="w-full text-right px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder=""
                      onChange={() => handleNewPassChange(event)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder=""
                      onChange={() => handleConfirmNewPassChange(event)}
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
                onClick={handleSaveClick}
              >
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}