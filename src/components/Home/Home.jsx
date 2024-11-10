import Brands from "../Brands/Brands";
import DataHome from "./DataHome1";
import DataHomePlay from "./DataHomePlay";
import SliderHome from "./SliderHome";
import SubCatigory from "./SubCatigory";

export default function Home() {

  
  return (

    <div className="">
       <SliderHome/>
       <SubCatigory/>
       <Brands/>
       <DataHome sectionName="المنتجات الرائجة" />
       <DataHome sectionName="أفضل المنتجات مبيعًا"/>
       <DataHomePlay/>
     
    </div>
  )
}
