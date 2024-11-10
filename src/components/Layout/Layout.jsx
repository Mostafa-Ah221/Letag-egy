import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout() {
  return (
    <div>
        <Navbar/>
        <div className="container mx-auto px-8 ">
      <Outlet>
      </Outlet>
    </div>
    <Footer/>
    </div>
  )
}
