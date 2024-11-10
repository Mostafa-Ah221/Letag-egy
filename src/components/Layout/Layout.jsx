import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SecondMenu from "../SecondMenu/SecondMenu";
import Menu from "../Menu/Menu";

export default function Layout() {
  return (
    <div>
      <Menu/>
      <div>
        <Navbar/>
        <SecondMenu/>
        <div className="container mx-auto px-8 ">
          <Outlet>
          </Outlet>
       </div>
    <Footer/>
      </div>
    </div>
  )
}
