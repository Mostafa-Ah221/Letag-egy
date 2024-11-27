import axios from "axios";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import * as Yup from 'yup';
import { ContextData } from "../../context/ContextApis";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMas, setErrorMas] = useState("");
  const { setUserToken } = useContext(ContextData);
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("email is invalid").required("email is required"),
    password: Yup.string().matches(/$/ , "password must start uppercase ").required("password is required"),
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
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        if (errorMessage.includes("email") || errorMessage.includes("password")) {
          setErrorMas("Email or Password is incorrect");
        } else {
          setErrorMas(errorMessage);
        }
        console.error("Error details:", error); 
      });
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
        <form onSubmit={formik.handleSubmit} className="md:col-span-6 order-1 col-span-12">
                <h2 className="text-2xl font-semibold text-center mb-7">Login Now</h2>

          <div className='grid grid-cols-12 gap-3'>
            <div className="mb-5 col-span-12">
              <label htmlFor="email" className="block mb-2 text-sm">Email*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                required
                type="email"
                id="email"
                className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none"
              />
              {formik.errors.email && formik.touched.email && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className="mb-5 col-span-12">
              <label htmlFor="password" className="block mb-2 text-sm">Password*</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                required
                type="password"
                id="password"
                className="border border-primary text-gray-900 text-sm rounded-md block w-full p-2.5 dark:placeholder-gray-400 focus:shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] outline-none"
              />
              {formik.errors.password && formik.touched.password && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  {formik.errors.password}
                </div>
              )}
            </div>
          </div>
          
          <button type="submit" className="bg-primary hover:tracking-widest duration-300 block text-white font-bold py-2 px-4 rounded mt-5 m-auto">
            {loading ? <ClipLoader color="#36d7b7" size={15} /> : "Login"}
          </button>
           <div className="ml-40 mt-5">
        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register Now</Link>
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
