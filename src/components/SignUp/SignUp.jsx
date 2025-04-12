import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import * as Yup from 'yup';
import { useLanguage } from "../../context/LanguageContextPro";

export default function SignUp({ handleRegister, loading, errorMas }) {
  const { language } = useLanguage();
 
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().min(3, "name minimum length is 3").max(10, "name maximum length is 10").required("name is required"),
    last_name: Yup.string().min(3, "name minimum length is 3").max(10, "name maximum length is 10").required("name is required"),
    email: Yup.string().email("email is invalid").required("email is required"),
    phone: Yup.string().matches(/^01[0125][0-9]{8}$/, "phone must be valid number").required("phone is required"),
    password: Yup.string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.").required("Password is required"),
    password_confirmation: Yup.string().oneOf([Yup.ref('password')], "password and confirm password must be the same").required("password confirmation is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: ""
    },
    validationSchema,
    onSubmit: (values) => {
      handleRegister(values);
    }
  });

  return (
    <div className="p-6 mb-11">
      {errorMas && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        {errorMas}
      </div>}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg mt-7">
          <form onSubmit={formik.handleSubmit} className="w-full p-2">
            <h2 className="text-2xl font-semibold text-center mb-7">
              {language === "ar" ? "سجل الآن" : "Register Now"}
            </h2>

            {/* الاسم الأول واسم العائلة */}
            <div className="grid grid-cols-12 gap-3">
              <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="first_name" className="block mb-2 text-sm">
                  {language === "ar" ? "الاسم الأول*" : "First Name*"}
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.first_name}
                  required
                  type="text"
                  id="first_name"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
                {formik.errors.first_name && formik.touched.first_name && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.first_name}</div>
                )}
              </div>
              <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="last_name" className="block mb-2 text-sm">
                  {language === "ar" ? "اسم العائلة*" : "Last Name*"}
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                  required
                  type="text"
                  id="last_name"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
                {formik.errors.last_name && formik.touched.last_name && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.last_name}</div>
                )}
              </div>
            </div>

            {/* البريد الإلكتروني ورقم الهاتف */}
            <div className="grid grid-cols-12 gap-3">
              <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="email" className="block mb-2 text-sm">
                  {language === "ar" ? "البريد الإلكتروني*" : "Email*"}
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                  type="email"
                  id="email"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>
              <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="phone" className="block mb-2 text-sm">
                  {language === "ar" ? "رقم الهاتف*" : "Phone*"}
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  required
                  type="text"
                  id="phone"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
                {formik.errors.phone && formik.touched.phone && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.phone}</div>
                )}
              </div>
            </div>

            {/* كلمة المرور وتأكيدها */}
            <div className="grid grid-cols-12 gap-3">
              <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="password" className="block mb-2 text-sm">
                  {language === "ar" ? "كلمة المرور*" : "Password*"}
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  required
                  type="password"
                  id="password"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>
              <div className="mb-5 col-span-12 md:col-span-6">
                <label htmlFor="password_confirmation" className="block mb-2 text-sm">
                  {language === "ar" ? "تأكيد كلمة المرور*" : "Confirm Password*"}
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password_confirmation}
                  required
                  type="password"
                  id="password_confirmation"
                  className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
                />
                {formik.errors.password_confirmation && formik.touched.password_confirmation && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.password_confirmation}</div>
                )}
              </div>
            </div>

            {/* زر التسجيل */}
            <button type="submit" className="bg-primary m-auto block hover:tracking-widest duration-300 text-white font-bold py-2 px-4 rounded mt-5">
              {loading ? <ClipLoader color="#36d7b7" size={15} /> : language === "ar" ? "سجل" : "Register"}
            </button>

            {/* رابط تسجيل الدخول */}
            <div className="text-center mt-5">
              {language === "ar" ? "هل لديك حساب؟" : "Do you have an account?"}
              <Link to="/login" className="text-primary font-semibold hover:underline ml-1">
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}