import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContextPro';
import { ContextData } from "../../context/ContextApis";
import axios from 'axios';

export default function UpdateProfile() {
  const [NameError, setNameError] = useState(false);
  const [EmailError, setEmailError] = useState(false);
  const [NewPassError, setNewPassError] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [Name, setName] = useState(null);
  const [Email, setEmail] = useState(null);
  const [ConfirmNewPass, setConfirmNewPass] = useState(null);
  const [ConfrinNewPassError, setConfrinNewPassError] = useState(false);
  const [isShown, setisShown] = useState(false);
  const [Phone, setPhone] = useState(null);
  const [user, setUser] = useState({});
  const { userData } = useContext(ContextData);
  const { language } = useLanguage();
  const userToken = localStorage.getItem("userToken"); // تأكد من أخذ التوكن من المحفوظات

  const isValid = (pattern, text) => {
    return new RegExp(pattern).test(text);
  };

  const handleCancel = () => {
    setisShown(false);
  };

  const handleNameChange = (e) => {
    const userName = e.target.value;
    if (userName.length <= 3) {
      setNameError(true);
      setName(userName);
    } else {
      setNameError(false);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    const valid = isValid(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/, email);
    if (email.length !== 0) {
      if (valid) {
        setEmailError(false);
        setEmail(email);
      } else {
        setEmailError(true);
      }
    }
  };

  const handleNewPassChange = (e) => {
    const newPass = e.target.value;
    const valid = isValid(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, newPass);
    if (newPass.length !== 0) {
      if (valid) {
        setNewPassError(false);
        setNewPassword(newPass);
      } else {
        setNewPassError(true);
      }
    }
  };

  const handleConfirmNewPassChange = (e) => {
    const newConfirmPass = e.target.value;
    if (newPassword != null) {
      if (newConfirmPass === newPassword) {
        setConfrinNewPassError(false);
        setConfirmNewPass(newConfirmPass);
      } else {
        setConfrinNewPassError(true);
      }
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    if (Name != null && Email != null && newPassword != null && ConfirmNewPass != null && Phone != null) {
      const formData = new FormData();

      formData.append("first_name", Name.split(" ")[0]);
      formData.append("last_name", Name.split(" ")[1]);
      formData.append("email", Email);
      formData.append("password", newPassword);
      formData.append("password_confirmation", ConfirmNewPass);
      formData.append("phone", Phone);

      try {
        const res = await axios.post("https://demo.leetag.com/api/customer/profile/update", formData, {
          headers: {
            "Accept": "application/json",
            'Authorization': userToken,
            "lang": language
          }
        });

        if (res.status === 200) { // تأكد من أن النتيجة 200 تعني نجاح الطلب
          setisShown(true);
        } else {
          setisShown(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setName(userData?.name);
    setEmail(userData?.email);
    setPhone(userData?.phone);
  }, [userData]);

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
                    onChange={(e) => handleNameChange(e)}
                    value={Name}
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
                      placeholder="البريد الإلكتروني"
                      className="w-full text-right px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      onChange={(e) => handleEmailChange(e)}
                      value={Email}
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      كلمة المرور الجديدة
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="w-full text-right px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="كلمة المرور الجديدة"
                      onChange={(e) => handleNewPassChange(e)}
                    />
                    {NewPassError ? <p className='my-2 text-red'>{language === "ar" ? "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل، وحرف صغير واحد، ورقم واحد، وحرف خاص واحد." : "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."}</p> : <></>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="تأكيد كلمة المرور"
                      onChange={(e) => handleConfirmNewPassChange(e)}
                    />
                    {ConfrinNewPassError ? <p className='my-2 text-red'>{language === "ar" ? "كلمة المرور غير متطابقة" : "Passwords don't match"}</p> : <></>}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                type="submit"
                onClick={handleSaveClick}
                disabled={NameError || EmailError || NewPassError || ConfrinNewPassError}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                حفظ التغييرات
                <Save className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
