import Brands from "../Brands/Brands";
import DataHome from "./DataHome1";
import DataHomePlay from "./DataHomePlay";
import SliderHome from "./SliderHome";
import SubCatigory from "./SubCatigory";
import { useLanguage } from "../../context/LanguageContextPro";
import SecondMenu from "../SecondMenu/SecondMenu";
import Navbar from "../Navbar/Navbar";

export default function Home() {
  const { language } = useLanguage();


  // تحديد قيم sectionName بناءً على اللغة
  const sections = {
    trending: language === "ar" ? "المنتجات الرائجة" : "featured",
    bestSelling: language === "ar" ? "أفضل المنتجات مبيعًا" : "best_sell",
  };

  return (
    <div className="bg-Neutral">
                
      <SliderHome />
      <SubCatigory />
      <Brands />
      {/* تم تمرير sectionName بناءً على اللغة */}
      <DataHome sectionName={sections.trending} />
      <DataHome sectionName={sections.bestSelling} />
      <DataHomePlay />
    </div>
  );
}
