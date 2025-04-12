import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import About from "./components/About/About";
import Contact from "./components/Contact-us/Contact";
// import Login from "./components/Login/Login";
// import SignUp from "./components/SignUp/SignUp";
import DataContextProveder from "./context/ContextApis";
import PageBrands from "./components/Brands/pageBrands";
import CategoryDetails from "./components/CategoryDetails/CategoryDetails";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import CartLayout from "./components/ShoppingCart/CartLayout";
import { CartContextProvider } from "./context/CartContext";
import { useEffect, useState } from "react";
import Stock from "./components/Stock/Stock";
import Profile from "./components/Profile/Profile";
import { LanguageContextPro } from "./context/LanguageContextPro";
import WishList from "./components/WishList/WishList";
import CartPage from "./components/CartPage/CartPage";
import { Toaster } from 'react-hot-toast';
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import PageMenu from "./components/PageMenu/PageMenu";
import SearchByItem from "./components/SearchByItem/SearchByItem";
import Orders from "./components/Orders/Orders";
import AddAddress from "./components/AddAddress/AddAddress";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import UpDateProfile from "./components/Profile/UpDateProfile";
import User from "./components/User/User";
import DataOrder from "./components/ShoppingCart/DataOrder";
import ShowOrder from "./components/Show Order/ShowOrder";
import Loader from "./components/Loader/Loader";
import Paid from "./components/Paid/Paid";
import MobileAuthentication from "./components/Login/MobileAuthentication";
import MobileSignup from "./components/SignUp/MobileSignup";
// import MapComponent from "./components/Stock/LocationPickerMap";
import GoogleMapComponent from "./components/Stock/LocationPickerMap";
import CheckRegister from "./components/check-auth/CheckRegister";
import CheckLogin from "./components/check-auth/CheckLogin";

import { requestForToken,initializeNotifications  } from "./components/fcm";


function App() {
  const [isStock, setIsStock] = useState(false);
let api_key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("https://tarshulah.com/api/domain/settings",{
          headers: {APP_KEY:api_key},
        });
        const resJson = await res.json();
        const data = await resJson.data;
        const stock = await data.multi_stocks_management;
        if (stock == 1) {
          setIsStock(true);
        }
        else {
          setIsStock(false);
        }
        // console.log(isStock);
      } catch (error) {
        console.log(error)
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await initializeNotifications();
        if (token) {
          console.log('تم تهيئة نظام الإشعارات بنجاح');
        }
      } catch (error) {
        console.error('حدث خطأ أثناء تهيئة نظام الإشعارات:', error);
      }
    };
    
    setupNotifications();
     requestForToken();
  }, []);
  let router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: isStock ? <GoogleMapComponent /> : <Home /> },
        { path: "home", element: isStock ? <Home /> : <Navigate replace to={"/"} /> },
        { path: "about", element: <About /> },
        { path: "stock", element: <Stock /> },
        { path: "Loader", element: <Loader /> },
        { path: "contactUs", element: <Contact /> },
        { path: "login", element: <CheckLogin /> },
        { path: "register", element: <CheckRegister /> },
        { path: "GoogleMapComponent", element: <GoogleMapComponent /> },
        // 
        { path: "loginMobile", element: <MobileAuthentication /> },
        { path: "registerMobile", element: <MobileSignup /> },
        // 
        { path: "forgetpassword", element: <ForgetPassword /> },
        { path: "pageBrand", element: <PageBrands /> },
        { path: "wishlist", element: <WishList /> },
        { path: "SearchByItem/:id", element: <SearchByItem /> },
        { path: "ShowOrder/:id", element: <ShowOrder /> },
        { path: "categoryDetails/:id", element: <CategoryDetails /> },
        { path: "productDetails/:id", element: <ProductDetails /> },
        { path: "categoryFilter/:id", element: <CategoryFilter /> },
        { path: "pagemenu/:id", element: <PageMenu /> },
        { path: "payment/status", element: <Paid /> },
        { path: "cartpage", element: <CartPage /> },
        { path: "AddAddress", element: <AddAddress /> },
        {
          path: "cartlayout",
          element: <CartLayout />,
          children: [
            { index: true, element: <DataOrder /> },
            // { path: "payment", element: <PayPage /> },

          ],
        },
        {
          path: "user", element: <User />,
          children: [
            { path: "", element: <Profile /> },
            { path: "updateProfile", element: <UpDateProfile /> },
            { path: "addAddress", element: <AddAddress /> },
            { path: "orders", element: <Orders /> },
          ]
        },
      ],
    },
  ]);

  return (
    <LanguageContextPro>
      <CartContextProvider>
        <DataContextProveder>
          <RouterProvider router={router} />
          <Toaster />
        </DataContextProveder>
      </CartContextProvider>
    </LanguageContextPro>
  );
}

export default App;
