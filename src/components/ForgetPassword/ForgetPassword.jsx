import axios from "axios";
import { useContext, useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import ClipLoader from "react-spinners/ClipLoader";
import { useFormik } from "formik";
import { useCart } from "../../context/CartContext";
import { ContextData } from "../../context/ContextApis";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMas, setErrorMas] = useState("");
  const [openSection, setOpenSection] = useState("email"); 
   const {api_key } = useContext(ContextData);
  const { language } = useLanguage();
      const { showToast } = useCart();
  

  async function handleForgotPassword(values) {
    console.log("Sending email request:", values.email);
    setLoading(true);

    try {
      const response = await axios.post(
        `https://tarshulah.com/api/customer/forgot-password`,
        { email: values.email },
        {
          headers: {
            "Accept": "application/json",
            "lang": language === "ar" ? "ar" : "en",
            APP_KEY:api_key
          },
        }
      );

      console.log("Response:", response.data);
      showToast(response.data.message);

      if (response.data.status) {
        setOpenSection("reset");
      }
    } catch (error) {
      console.error("Error during request:", error.response?.data || error.message);
      setErrorMas(
        language === "ar"
          ? "حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً."
          : "An error occurred while connecting to the server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(values) {
    setLoading(true);

    const formData = new FormData();
    formData.append("otp", values.otp.trim());
    formData.append("password", values.password);
    formData.append("password_confirmation", values.confirmPassword);

    try {
      const response = await axios.post(
        `https://tarshulah.com/api/customer/reset-password/${values.email}`,
        formData,
        {
          headers: {
            "Accept": "application/json",
            "lang": language === "ar" ? "ar" : "en",
            "Content-Type": "multipart/form-data",
            APP_KEY:api_key
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.status) {
       showToast(response.data.message)
      } 
    } catch (error) {
      console.error("Error during reset:", error.response?.data || error.message);
      setErrorMas(
        error.response?.data?.message ||
        (language === "ar"
          ? "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقاً."
          : "An unexpected error occurred. Please try again later.")
      );
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: { email: "", otp: "", password: "", confirmPassword: "" },
    onSubmit: (values) => {
      if (openSection === "email") {
        handleForgotPassword(values);
      } else if (openSection === "reset") {
        handleResetPassword(values);
      }
    },
  });

  return (
    <>
      {errorMas && <p className="text-red-600 mt-3 text-center">{errorMas}</p>}

      <div className="grid grid-cols-12 gap-5 p-6 my-11">
        {openSection === "email" && (
          <div className="md:col-span-6 col-span-12">
            <h2 className="text-2xl font-semibold text-center mb-7">
              {language === "ar" ? "إعادة تعيين كلمة السر" : "Reset Your Password"}
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-5 col-span-12">
                <label htmlFor="email" className="block mb-2 text-sm">
                  {language === "ar" ? "الإيميل" : "Email"}*
                </label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                  type="email"
                  id="email"
                  name="email"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded"
              >
                {loading ? (
                  <ClipLoader color="#36d7b7" size={15} />
                ) : language === "ar" ? (
                  "إرسال رابط إعادة تعيين كلمة المرور"
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        )}

        {openSection === "reset" && (
          <div className="md:col-span-6 col-span-12">
            <h2 className="text-2xl font-semibold text-center mb-7">
              {language === "ar" ? "إعادة تعيين كلمة السر" : "Reset Your Password"}
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-5 col-span-12">
                <label htmlFor="otp" className="block mb-2 text-sm">
                  {language === "ar" ? "رمز OTP" : "OTP"}*
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
              </div>
              <div className="mb-5 col-span-12">
                <label htmlFor="password" className="block mb-2 text-sm">
                  {language === "ar" ? "كلمة المرور الجديدة" : "New Password"}*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
              </div>
              <div className="mb-5 col-span-12">
                <label htmlFor="confirmPassword" className="block mb-2 text-sm">
                  {language === "ar"
                    ? "تأكيد كلمة المرور"
                    : "Confirm New Password"}
                  *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded mt-5"
              >
                {language === "ar" ? "حفظ كلمة المرور" : "Save Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
