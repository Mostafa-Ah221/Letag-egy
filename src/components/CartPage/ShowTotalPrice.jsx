import { Languages } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { GiBeachBag } from 'react-icons/gi';
import { useLanguage } from '../../context/LanguageContextPro';

export default function ShowTotalPrice() {
  const { getTotalPrice } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const prevPriceRef = useRef(getTotalPrice);
  const timerRef = useRef(null);
    const { language } = useLanguage();
  

  useEffect(() => {
    // تنظيف المؤقت السابق إذا وجد
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // إذا تغير السعر
    if (getTotalPrice !== prevPriceRef.current) {
      prevPriceRef.current = getTotalPrice;
      setIsVisible(true);
      
      // تعيين مؤقت جديد للإخفاء
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [getTotalPrice]);

  return (
    <div
      className={`
        w-72 h-14 
        bg-slate-50 rounded-3xl fixed  z-40 top-10 left-[50%] -translate-x-[50%] flex  justify-center items-center transition-all duration-500  ease-in-out
        border border-primary
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-full pointer-events-none'
        }
      `}
    >
        {language === "ar"? <p className="flex justify-between items-center gap-5"><span>إجمالي السلة: </span> <span className=" border border-primary rounded-xl w-10 h-10 flex justify-between items-center">{getTotalPrice}</span><GiBeachBag className="text-primary text-4xl" /></p>
        :
         <p className="flex justify-center items-center gap-3"><span>Total Cart:</span> <span className=" border border-primary rounded-xl w-10 h-10 flex justify-center items-center">{getTotalPrice}</span><GiBeachBag className="text-primary text-4xl"/></p> 
        }
      {/* <p className="text-white text-lg font-semibold">
        {getTotalPrice}
      </p> */}
    </div>
  );
}