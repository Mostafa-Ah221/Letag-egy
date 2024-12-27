import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import About from "./components/About/About";
import Contact from "./components/Contact-us/Contact";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import DataContextProveder from "./context/ContextApis";
import PageBrands from "./components/Brands/pageBrands";
import CategoryDetails from "./components/CategoryDetails/CategoryDetails";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import CartLayout from "./components/ShoppingCart/CartLayout";
// import PayPage from "./components/ShoppingCart/PayPage";
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



function App() {
  const [isStock, setIsStock] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("https://tarshulah.com/api/domain/settings");
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
        // console.log(error)
      }
    };
    fetchdata();
  }, []);

  let router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: isStock ? <Stock /> : <Home /> },
        { path: "home", element: isStock ? <Home /> : <Navigate replace to={"/"} /> },
        { path: "about", element: <About /> },
        { path: "Loader", element: <Loader /> },
        { path: "contactUs", element: <Contact /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <SignUp /> },
        { path: "forgetpassword", element: <ForgetPassword /> },
        { path: "pageBrand", element: <PageBrands /> },
        { path: "wishlist", element: <WishList /> },
        { path: "SearchByItem/:id", element: <SearchByItem /> },
        { path: "ShowOrder/:id", element: <ShowOrder /> },
        { path: "categoryDetails/:id", element: <CategoryDetails /> },
        { path: "productDetails/:id", element: <ProductDetails /> },
        { path: "categoryFilter/:id", element: <CategoryFilter /> },
        { path: "pagemenu/:id", element: <PageMenu /> },
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
