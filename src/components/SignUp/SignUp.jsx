import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import * as Yup from 'yup';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMas, setErrorMas] = useState("");
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().min(3, "name minimum length is 3").max(10, "name maximum length is 10").required("name is required"),
    last_name: Yup.string().min(3, "name minimum length is 3").max(10, "name maximum length is 10").required("name is required"),
    email: Yup.string().email("email is invalid").required("email is required"),
    phone: Yup.string().matches(/^01[0125][0-9]{8}$/, "phone must be valid number").required("phone is required"),
    password: Yup.string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.").required("Password is required"),
    password_confirmation: Yup.string().oneOf([Yup.ref('password')], "password and confirm password must be the same").required("password confirmation is required"),
  });

  function handleRegister(values) {
    setLoading(true);
    axios.post(`https://demo.leetag.com/api/customer/register`, values)
      .then((apiResponse) => {
        setLoading(false);
        navigate('/login');
        alert(apiResponse.data.message);
      })
      .catch((apiResponse) => {
        setLoading(false);
        setErrorMas(apiResponse.response.data.message);
      });
  }

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
    onSubmit: handleRegister
  });

  return (
    <div className="p-6 my-11">
      {errorMas && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        {errorMas}
      </div>}
      <div className='grid grid-cols-12 gap-5'>
        <form onSubmit={formik.handleSubmit} className="md:col-span-6 order-2 col-span-12">
          <h2 className="text-2xl font-semibold text-center mb-7">Register Now</h2>
          <div className='grid grid-cols-12 gap-3'>
            <div className="mb-5 col-span-12 md:col-span-6">
              <label htmlFor="first_name" className="block mb-2 text-sm">First Name*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.first_name}
                required
                type="text"
                id="first_name"
                className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
              />
              {formik.errors.first_name && formik.touched.first_name && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.first_name}
                </div>
              )}
            </div>
            <div className="mb-5 col-span-12 md:col-span-6">
              <label htmlFor="last_name" className="block mb-2 text-sm">Last Name*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.last_name}
                required
                type="text"
                id="last_name"
                className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
              />
              {formik.errors.last_name && formik.touched.last_name && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.last_name}
                </div>
              )}
            </div>
          </div>
          <div className='grid grid-cols-12 gap-3'>
            <div className="mb-5 col-span-12 md:col-span-6">
              <label htmlFor="email" className="block mb-2 text-sm">Email*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                required
                type="email"
                id="email"
                className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
              />
              {formik.errors.email && formik.touched.email && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className="mb-5 col-span-12 md:col-span-6">
              <label htmlFor="phone" className="block mb-2 text-sm">Phone*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
                required
                type="text"
                id="phone"
                className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none text-right"
              />
              {formik.errors.phone && formik.touched.phone && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.phone}
                </div>
              )}
            </div>
          </div>
          <div className='grid grid-cols-12 gap-3'>
            <div className="mb-5 col-span-12 md:col-span-6">
              <label htmlFor="password" className="block mb-2 text-sm">Password*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                required
                type="password"
                id="password"
                className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none "
              />
              {formik.errors.password && formik.touched.password && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.password}
                </div>
              )}
            </div>
            <div className="mb-5 col-span-12 md:col-span-6">
              <label htmlFor="password_confirmation" className="block mb-2 text-sm">Confirm Password*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password_confirmation}
                required
                type="password"
                id="password_confirmation"
                className={`border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none `}
              />
              {formik.errors.password_confirmation && formik.touched.password_confirmation && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.password_confirmation}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="bg-primary m-auto block  hover:tracking-widest duration-300 text-white font-bold py-2 px-4 rounded mt-5"> {loading ? <ClipLoader color="#36d7b7" size={15} /> : "Register"}</button>
          <div className="ml-40 mt-5">
            Do you have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
          </div>
        </form>
        <div className="relative hidden md:block col-span-0 md:col-span-6 order-1 w-full h-96">
          <div className="absolute top-0 right-0 w-full h-full bg-primary opacity-40"></div>
          <img className="w-full h-full object-cover" src="https://khamato.com/themes/default/assets/images/login.png" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
}
