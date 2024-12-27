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
  const { userData,userToken } = useContext(ContextData);
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
    <div className="min-h-screen">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {language === "ar" ? "تحديث الملف الشخصي" : "Update Profile"}
          </h2>
          <p className="mt-2 text-center text-gray-500">
            {language === "ar" ? "قم بتحديث معلوماتك الشخصية وكلمة المرور" : "Update your personal information and password"}
          </p>
        </div>

        <div className="p-6">
          <form>
            {/* First Name */}
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "الاسم الأول" : "First Name"} <span className="text-red-500">*</span>
              </label>
              <input
                id="first-name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={language === "ar" ? "أدخل الاسم الأول" : "Enter first name"}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "الاسم الأخير" : "Last Name"} <span className="text-red-500">*</span>
              </label>
              <input
                id="last-name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={language === "ar" ? "أدخل الاسم الأخير" : "Enter last name"}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "البريد الإلكتروني" : "Email"} <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={language === "ar" ? "أدخل البريد الإلكتروني" : "Enter email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "الهاتف" : "Phone"} <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "كلمة المرور الجديدة" : "New Password"}
              </label>
              <input
                id="new-password"
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={language === "ar" ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && <p className="text-red-500">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={language === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSaveClick}
              className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-lg"
            >
              <Save className="w-5 h-5" />
              {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
            </button>
          </form>
        </div>

      
      </div>
    </div>
  );
}
