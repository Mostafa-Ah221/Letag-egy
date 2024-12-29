import axios from "axios";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContextPro";
import ClipLoader from "react-spinners/ClipLoader";
import { useFormik } from "formik";
import * as Yup from 'yup';

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMas, setErrorMas] = useState("");
  const [openSection, setOpenSection] = useState("email"); // الحالة المبدئية لإظهار فورم الإيميل
  const { language } = useLanguage();

  // const validationSchema = Yup.object().shape({
  //   email: Yup.string().email("email is invalid").required("email is required"),
  //   password: Yup.string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.").required("Password is required"),
  //   confirmPassword: Yup.string().oneOf([Yup.ref('password')], "password and confirm password must be the same").required("password confirmation is required"),
  // });


 async function handleForgotPassword(values) {
  console.log("Sending email request:", values.email); 
  setLoading(true);

  try {
    const response = await axios.post(
      `https://demo.leetag.com/api/customer/forgot-password`,
      { email: values.email }
    );
    
    console.log(response); // تحقق من الاستجابة

    // إرسال الرسالة كما هي من الاستجابة سواء كانت ناجحة أو لا
    setErrorMas(response.data.message);

    // إذا كانت العملية ناجحة سيتم الانتقال إلى المرحلة التالية
    if (response.data.status) {
      setOpenSection("reset");
    }
  } catch (error) {
    console.error("Error during request:", error); 
    setErrorMas(
      language === "ar"
        ? "حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً."
        : "An error occurred while connecting to the server. Please try again later."
    );
  } finally {
  setLoading(false);
  }
}




  // دالة التعامل مع طلب إعادة تعيين كلمة المرور باستخدام OTP
  async function handleResetPassword(values) {
    setLoading(true);

    const formData = new FormData();
    formData.append("otp", values.otp);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.confirmPassword);

    try {
      const response = await axios.post(
        `https://demo.leetag.com/api/customer/reset-password`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      if (response.data.status) {
        setErrorMas(
          language === "ar"
            ? "تم إعادة تعيين كلمة المرور بنجاح."
            : "Password reset successfully."
        );
      } else {
        setErrorMas(
          language === "ar"
            ? "حدث خطأ أثناء إعادة تعيين كلمة المرور. حاول مرة أخرى."
            : "Error resetting password. Please try again."
        );
      }
    } catch (error) {
      setErrorMas(
        language === "ar"
          ? "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى لاحقاً."
          : "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: { email: "", otp: "", password: "", confirmPassword: "" },
    // validationSchema,
    onSubmit: (values) => {
      if (openSection === "email") {
        handleForgotPassword(values); // إرسال الإيميل إذا كان القسم الحالي هو email
      } else if (openSection === "reset") {
        handleResetPassword(values); // إعادة تعيين كلمة المرور إذا كان القسم الحالي هو reset
      }
    },
  });

  return (
    <>
      {errorMas && <p className="text-red-600 mt-3 text-center">{errorMas}</p>}

      <div className="grid grid-cols-12 gap-5 p-6 my-11">
        {/* قسم إرسال الإيميل */}
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
            <p
              onClick={() => setOpenSection("reset")}
              className="cursor-pointer text-primary mt-3 text-center"
            >
              {language === "ar" ? "تعيين كلمة المرور" : "Set Password"}
            </p>
          </div>
        )}

        {/* قسم إعادة تعيين كلمة المرور */}
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
                  {language === "ar" ? "تأكيد كلمة المرور" : "Confirm New Password"}*
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

        {/* صورة توضيحية */}
        <div className="relative hidden md:block md:col-span-6 col-span-12 w-full h-96">
          <div className="absolute top-0 right-0 w-full h-full bg-primary opacity-40"></div>
          <img
            className="w-full h-full object-cover"
            src="https://khamato.com/themes/default/assets/images/login.png"
            alt="Login Illustration"
          />
        </div>
      </div>
    </>
  );
}
