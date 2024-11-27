import { useState } from "react";
import Brands from "../Brands/Brands";
import DataHome from "./DataHome1";
import DataHomePlay from "./DataHomePlay";
import SliderHome from "./SliderHome";
import SubCatigory from "./SubCatigory";
import { useLanguage } from "../../context/LanguageContextPro";

export default function Home() {
  // تحديد اللغة (مبدئيًا العربية، يمكن تغييرها حسب الحاجة)
  const { language } = useLanguage();


  // تحديد قيم sectionName بناءً على اللغة
  const sections = {
    trending: language === "ar" ? "المنتجات الرائجة" : "featured",
    bestSelling: language === "ar" ? "أفضل المنتجات مبيعًا" : "best_sell",
  };

  return (
    <div className="">
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
