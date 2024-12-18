import axios from "axios";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import * as Yup from 'yup';
import { ContextData } from "../../context/ContextApis";
import { useLanguage } from "../../context/LanguageContextPro";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMas, setErrorMas] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const { setUserToken } = useContext(ContextData);
  const { language } = useLanguage(); // استرجاع اللغة من السياق
  
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(language === "ar" ? "الايمال غير صالح" : "Email is invalid")
      .required(language === "ar" ? "الايمال مطلوب" : "Email is required"),
    password: Yup.string()
      .matches(/^[A-Z].*$/, language === "ar" ? "يجب أن تبدأ كلمة السر بحرف كبير" : "Password must start with an uppercase letter")
      .required(language === "ar" ? "كلمة السر مطلوبة" : "Password is required"),
  });

  function handleRegister(values) {
    setLoading(true);
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    axios.post(`https://demo.leetag.com/api/customer/login`, formData)
      .then((apiResponse) => {
        const tokenUser = apiResponse?.data?.data.user.original.access_token;
        localStorage.setItem("userToken", tokenUser);
        setUserToken(tokenUser);
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.response?.data?.message || error.message || (language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
        if (errorMessage.includes("email") || errorMessage.includes("password")) {
          setErrorMas(language === "ar" ? "الايمال أو كلمة السر غير صحيحة" : "Email or Password is incorrect");
        } else {
          setErrorMas(errorMessage);
        }
        console.error("Error details:", error);
      });
  }

  async function handleForgotPassword(values) {
    setLoading(true);
    console.log("Sending email:", values.email);

    try {
      const response = await axios.post(`https://tarshulah.com/api/customer/forgot-password`, {
        email: values.email
      });

      if (!response.data.status) {
        setErrorMas(language === "ar" 
          ? "هذا البريد الإلكتروني غير مُسجل. الرجاء التأكد من صحة البريد." 
          : "We can't find a user with that email address.");
      } else {
        setErrorMas(language === "ar" 
          ? "تم إرسال رابط إعادة تعيين كلمة المرور بنجاح." 
          : "Password reset link sent successfully.");
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);

      if (error.response?.data?.message) {
        setErrorMas(language === "ar" 
          ? "هذا البريد الإلكتروني غير مُسجل. الرجاء التأكد من صحة البريد." 
          : error.response.data.message);
      } else {
        setErrorMas(language === "ar" 
          ? "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقاً." 
          : "An unexpected error occurred. Please try again later.");
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleRegister
  });

  return (
    <div className="p-6 my-11">
      {errorMas && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          {errorMas}
        </div>
      )}
      <div className='grid grid-cols-12 gap-5'>
        {/* Form Section for Login */}
        {openSection !== "Forgot" && (
          <div className="md:col-span-6 order-1 col-span-12">
            <form onSubmit={formik.handleSubmit}>
              <h2 className="text-2xl font-semibold text-center mb-7">{language === "ar" ? "تسجيل الدخول الآن" : "Login Now"}</h2>
              <div className='grid grid-cols-12 gap-3'>
                <div className="mb-5 col-span-12">
                  <label htmlFor="email" className="block mb-2 text-sm">{language === "ar" ? "الايمال" : "Email"}*</label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                    type="email"
                    id="email"
                    className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                  />
                </div>
                <div className="mb-5 col-span-12">
                  <label htmlFor="password" className="block mb-2 text-sm">{language === "ar" ? "كلمة السر" : "Password"}*</label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    required
                    type="password"
                    id="password"
                    className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                  />
                </div>
              </div>
              <div className="inline-flex items-center">
                <p className="mr-2">{language === "ar" ? "هل نسيت كلمة السر؟" : "Forgot Password?"}</p>
                <p onClick={() => setOpenSection("Forgot")} className="text-primary font-semibold hover:underline cursor-pointer">
                  {language === "ar" ? "انقر هنا" : "Click Here"}
                </p>
              </div>
              <button type="submit" className="bg-primary hover:tracking-widest duration-300 block text-white font-bold py-2 px-4 rounded mt-5 m-auto">
                {loading ? <ClipLoader color="#36d7b7" size={15} /> : (language === "ar" ? "تسجيل الدخول" : "Login")}
              </button>
            </form>
          </div>
        )}

        {/* Forgot Password Section */}
        {openSection === "Forgot" && (
          <div className="md:col-span-6 order-1 col-span-12">
            <h2 className="text-2xl font-semibold text-center mb-7">{language === "ar" ? "إعادة تعيين كلمة السر" : "Reset Your Password"}</h2>
            <form>
              <div className="mb-5 col-span-12">
                <label htmlFor="email" className="block mb-2 text-sm">{language === "ar" ? "الايمال" : "Email"}*</label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                  type="email"
                  id="email"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
              </div>
              <button type="button" onClick={() => handleForgotPassword(formik.values)} className="bg-primary text-white py-2 px-4 rounded mt-5 m-auto">
                {loading ? <ClipLoader color="#36d7b7" size={15} /> : (language === "ar" ? "إرسال رابط إعادة تعيين كلمة المرور" : "Send Reset Link")}
              </button>
              <div className="text-center mt-4">
                <p onClick={() => setOpenSection(null)} className="text-primary font-semibold hover:underline cursor-pointer">
                  {language === "ar" ? "العودة لتسجيل الدخول" : "Back to Login"}
                </p>
              </div>
            </form>
          </div>
        )}
        <div className="relative hidden md:block col-span-0 md:col-span-6 order-1 w-full h-96">
          <div className="absolute top-0 right-0 w-full h-full bg-primary opacity-40"></div>
          <img className="w-full h-full object-cover" src="https://khamato.com/themes/default/assets/images/login.png" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
}
