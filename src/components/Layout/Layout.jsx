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
    <div className="min-h-screen flex flex-col ">
       <ScrollToTop />
       
      <div className="grid grid-cols-12">
       
        <div className="col-span-1 hidden lg:block">
          <Menu />
        </div>
          <MenuMobile/>
        <div className={`col-span-12 lg:col-span-11 flex flex-col w-full lg:px-3 p-0 ${language === "ar" ? " ml-7":"mr-7"}`}>  
          <Navbar/>
          <SecondMenu/>
        <div className={` bg-Neutral  container flex-grow `}>
          <Outlet>
          </Outlet>
       </div>
    <Footer/>
     </div>
      </div>
    </div>
  )
}
