import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SecondMenu from "../SecondMenu/SecondMenu";
import Menu from "../Menu/Menu";
import MenuMobile from "../Menu/MenuMobile";

export default function Layout() {
  return (
    <div>
      <div className="grid grid-cols-12 ">
        <div className="col-span-1">
          <Menu />
        </div>
          <MenuMobile/>
        <div className="col-span-11">
          <Navbar/>
          <SecondMenu/>
        <div className="container px-3">
          <Outlet>
          </Outlet>
       </div>
    <Footer/>
     </div>
      </div>
    </div>
  )
}
