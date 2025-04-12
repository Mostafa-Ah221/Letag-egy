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
  const { setUserToken ,api_key} = useContext(ContextData);
  const { language } = useLanguage(); 
  
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(language === "ar" ? "الايمال غير صالح" : "Email is invalid")
      .required(language === "ar" ? "الايمال مطلوب" : "Email is required"),
    password: Yup.string()
      .matches(/$/ , language === "ar" ? "يجب أن تبدأ كلمة السر بحرف كبير" : "Password must start with an uppercase letter")
      .required(language === "ar" ? "كلمة السر مطلوبة" : "Password is required"),
  });

 function handleRegister(values) {
  setLoading(true);
  // console.log("Login Attempt:", values); // تتبع البيانات المرسلة

<<<<<<< HEAD
  axios.post(`https://tarshulah.com/api/customer/login`, {
=======
  axios.post(`https://tarshulah.comapi/customer/login`, {
>>>>>>> f6d5bffa363b703de435195315d532c6e471109b
    email: values.email,
    password: values.password
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      APP_KEY:api_key
    }
  })
  .then((apiResponse) => {
    
    const tokenUser = 
      apiResponse.data?.data?.user?.original?.access_token ||
      apiResponse.data?.access_token ||
      apiResponse.data?.token;

    if (tokenUser) {
      localStorage.setItem("userToken", tokenUser);
      setUserToken(tokenUser);
      navigate('/');
    } else {
      console.error("No token found in response");
      setErrorMas(language === "ar" ? "خطأ في استخراج التوكن" : "Error extracting token");
    }
    
    setLoading(false);
  })
  .catch((error) => {
    setLoading(false);
    // console.error("Complete Error Object:", error);
    // console.error("Error Response:", error.response);
    // console.error("Error Request:", error.request);

    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      (language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");

    setErrorMas(errorMessage);
  });
}

  // async function handleForgotPassword(values) {
  //   setLoading(true);
  //   console.log("Sending email:", values.email);

  //   try {
  //     const response = await axios.post(`https://tarshulah.com/api/customer/forgot-password`, {
  //       email: values.email
  //     });

  //     if (!response.data.status) {
  //       setErrorMas(language === "ar" 
  //         ? "هذا البريد الإلكتروني غير مُسجل. الرجاء التأكد من صحة البريد." 
  //         : "We can't find a user with that email address.");
  //     } else {
  //       setErrorMas(language === "ar" 
  //         ? "تم إرسال رابط إعادة تعيين كلمة المرور بنجاح." 
  //         : "Password reset link sent successfully.");
  //     }
      
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error fetching products:", error);

  //     if (error.response?.data?.message) {
  //       setErrorMas(language === "ar" 
  //         ? "هذا البريد الإلكتروني غير مُسجل. الرجاء التأكد من صحة البريد." 
  //         : error.response.data.message);
  //     } else {
  //       setErrorMas(language === "ar" 
  //         ? "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقاً." 
  //         : "An unexpected error occurred. Please try again later.");
  //     }
  //   }
  // }

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
      <div className="flex items-center justify-center min-h-screen">

        {/* Form Section for Login */}
      
          <div className="w-1/2">
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
                <Link to={'/forgetpassword'}  className="text-primary font-semibold hover:underline cursor-pointer">
                  {language === "ar" ? "انقر هنا" : "Click Here"}
                </Link>
              </div>
              <button type="submit" className="bg-primary hover:tracking-widest duration-300 block text-white font-bold py-2 px-4 rounded mt-5 m-auto">
                {loading ? <ClipLoader color="#36d7b7" size={15} /> : (language === "ar" ? "تسجيل الدخول" : "Login")}
              </button>
              <div className="flex justify-center mt-7">
                {language === "ar" 
                  ? <>
                      ليس لديك حساب؟{" "}
                      <Link to="/register" className="text-primary font-semibold hover:underline">
                        سجل الآن
                      </Link>
                    </>: <>
                      Don't have an account?{" "}
                      <Link to="/register" className="text-primary font-semibold hover:underline">
                        Register Now
                      </Link>
                    </>
                }
              </div>

            </form>
          </div>

      </div>
      </div>
  );
}
