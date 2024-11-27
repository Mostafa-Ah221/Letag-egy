import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SecondMenu from "../SecondMenu/SecondMenu";
import Menu from "../Menu/Menu";
import MenuMobile from "../Menu/MenuMobile";
import { useLanguage } from "../../context/LanguageContextPro";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

export default function Layout() {
      const { language } = useLanguage();

  return (
    <div>
       <ScrollToTop />
      <div className="grid grid-cols-12 ">
        <div className="col-span-1">
          <Menu />
        </div>
          <MenuMobile/>
        <div className="col-span-11 ">
          <Navbar/>
          <SecondMenu/>
        <div className={`container ${language === "ar" ? "pl-11 pr-0":"pl-4 pr-7"}`}>
          <Outlet>
          </Outlet>
       </div>
    <Footer/>
     </div>
      </div>
    </div>
  )
}
