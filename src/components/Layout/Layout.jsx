import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SecondMenu from "../SecondMenu/SecondMenu";
import Menu from "../Menu/Menu";
import MenuMobile from "../Menu/MenuMobile";

export default function Layout() {
  return (
    <div>
      <div>
          <Menu />
          <MenuMobile/>
        <div className="">
          <Navbar/>
       
        <SecondMenu/>
      
        <div className="container mx-auto px-8">
          <Outlet>
          </Outlet>
       </div>
    <Footer/>
     </div>
      </div>
    </div>
  )
}
