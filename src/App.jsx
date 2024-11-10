import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

function App() {
  let router = createBrowserRouter([
    {
      path: "",
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
