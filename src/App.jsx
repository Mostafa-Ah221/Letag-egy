import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact-us/Contact";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import DataContextProveder from "./context/ContextApis";
import PageBrands from "./components/Brands/pageBrands";
import CategoryDetails from "./components/CategoryDetails/CategoryDetails";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import CartLayout from "./components/ShoppingCart/CartLayout";
import Address from "./components/ShoppingCart/Address";
import PayPage from "./components/ShoppingCart/PayPage";
import Review from "./components/ShoppingCart/Review";
import Shipping from "./components/ShoppingCart/Shipping";
import {CartContextProvider} from "./context/CartContext";
import { useEffect } from "react";

function App() {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  let router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contactUs", element: <Contact /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <SignUp /> },
        { path: "pageBrand", element: <PageBrands /> },
        { path: "categoryDetails", element: <CategoryDetails /> },
        { path: "productDetails", element: <ProductDetails /> },
        {
          path: "cartlayout",
          element: <CartLayout />,
          children: [
            { index: true, element: <Address /> },
            { path: "shipping", element: <Shipping /> },
            { path: "payment", element: <PayPage /> },
            { path: "review", element: <Review /> },
          ],
        },
      ],
    },
  ]);

  return (
    <CartContextProvider>
    <DataContextProveder>
      <RouterProvider router={router} />
    </DataContextProveder>
    </CartContextProvider>
  );
}

export default App;
