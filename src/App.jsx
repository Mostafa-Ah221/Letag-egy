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
import { useEffect, useState } from "react";
import Stock from "./components/Stock/Stock";
import Profile from "./components/Profile/Profile";


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
          setIsStock(false);
        }
        else {
          setIsStock(false);
        }
        console.log(isStock);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  let router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { path: "/", element: isStock ? <Stock /> : <Home /> },
        { path: "home", element: isStock ? <Home /> : <Navigate replace to={"/"} /> },
        { path: "about", element: <About /> },
        { path: "contactUs", element: <Contact /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <SignUp /> },
        { path: "pageBrand", element: <PageBrands /> },
        { path: "categoryDetails", element: <CategoryDetails /> },
        { path: "productDetails", element: <ProductDetails /> },
        { path: "profile", element: <Profile /> }
      ],
    },
  ]);

  return (
    <div>
      <DataContextProveder>
        <RouterProvider router={router} />
      </DataContextProveder>
    </div>
  );
}

export default App;
