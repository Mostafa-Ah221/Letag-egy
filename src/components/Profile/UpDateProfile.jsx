import { useState, useContext, useEffect } from 'react';
import { User, Mail, Lock, Save, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContextPro';
import { ContextData } from "../../context/ContextApis";
import axios from 'axios';
import { useCart } from '../../context/CartContext';

export default function UpdateProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { userData, userToken,api_key } = useContext(ContextData);
  const { language } = useLanguage();
  const { showToast } = useCart();

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = language === "ar" ? "الاسم الأول مطلوب" : "First name is required";
    if (!lastName.trim()) newErrors.lastName = language === "ar" ? "الاسم الأخير مطلوب" : "Last name is required";
    if (!email.trim() || !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      newErrors.email = language === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email address";
    }
    if (!phone.trim() || phone.length < 10) {
      newErrors.phone = language === "ar" ? "رقم الهاتف غير صالح" : "Invalid phone number";
    }
    if (newPassword && newPassword.length < 8) {
      newErrors.newPassword = language === "ar"
        ? "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
        : "Password must be at least 8 characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      if (newPassword) formData.append("password", newPassword);
      formData.append("password_confirmation", confirmPassword);

      try {
        const res = await axios.post("https://demo.leetag.com/api/customer/profile/update", formData, {
          headers: {
            'Authorization': userToken,
            'lang': language,
            APP_KEY:api_key
          },
        });

        if (res.status === 200) {
          showToast(language === "ar" 
            ? "تم تحديث حسابك بنجاح، شكرًا لك" 
            : res.data.message 
          );
        }
      } catch (error) {
        console.error(error);
        showToast(language === "ar" 
          ? "حدث خطأ أثناء تحديث الحساب" 
          : "An error occurred while updating the account"
        );
      }
    }
  };

  useEffect(() => {
    setFirstName(userData?.name || '');
    setLastName(userData?.last_name || '');
    setEmail(userData?.email || '');
    setPhone(userData?.phone || '');
  }, [userData]);

  return (
    <div className="min-h-screen p-4 md:p-6 text-sm">
      <div className="max-w-2xl  bg-white rounded-xl shadow-lg">
        <div className="p-4 md:p-6 border-b">
          <h2 className="text-lg md:text-xl font-bold text-start md:text-center text-gray-900">
            {language === "ar" ? "تحديث الملف الشخصي" : "Update Profile"}
          </h2>
          <p className="mt-2 text-start md:text-center text-gray-500 text-xs md:text-sm">
            {language === "ar" ? "قم بتحديث معلوماتك الشخصية وكلمة المرور" : "Update your personal information and password"}
          </p>
        </div>

        <div className="p-4 md:p-6">
          <form className="space-y-4">
            {/* First Name */}
            <div>
              <label htmlFor="first-name" className="block mb-1 text-sm font-medium text-gray-700">
                {language === "ar" ? "الاسم الأول" : "First Name"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="first-name"
                  className="w-[16rem] md:w-full  pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder={language === "ar" ? "أدخل الاسم الأول" : "Enter first name"}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last-name" className="block mb-1 text-sm font-medium text-gray-700">
                {language === "ar" ? "الاسم الأخير" : "Last Name"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="last-name"
                  className="md:w-full w-[16rem] pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder={language === "ar" ? "أدخل الاسم الأخير" : "Enter last name"}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                {language === "ar" ? "البريد الإلكتروني" : "Email"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  className="md:w-full w-[16rem]  pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder={language === "ar" ? "أدخل البريد الإلكتروني" : "Enter email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                {language === "ar" ? "الهاتف" : "Phone"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="phone"
                  className="md:w-full w-[16rem]  pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder={language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="new-password" className="block mb-1 text-sm font-medium text-gray-700">
                {language === "ar" ? "كلمة المرور الجديدة" : "New Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="new-password"
                  type="password"
                  className="md:w-full w-[16rem]  pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder={language === "ar" ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block mb-1 text-sm font-medium text-gray-700">
                {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirm-password"
                  type="password"
                  className="md:w-full w-[16rem]  pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder={language === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSaveClick}
              className="mt-6 md:w-full w-[16rem]  bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{language === "ar" ? "حفظ التغييرات" : "Save Changes"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}