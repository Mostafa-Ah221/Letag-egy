import { useState } from "react";
import { faCartShopping, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function ShoppingCart() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="w-full">
      {/* زر فتح العربة */}
      <div 
        className="bg-primary flex items-center justify-center w-full h-14 hover:cursor-pointer"
        onClick={toggleCart}
    >
        <FontAwesomeIcon icon={faCartShopping} className="text-white text-[1.3rem]" />
      </div>

      {/* المظلل (الـ Overlay) */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={toggleCart}
        ></div>
      )}

      {/* النافذة الجانبية */}
      <div 
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`} 
        style={{ width: '50vw' }}
      >
        <div className="p-4 relative h-full overflow-y-auto">
            <div className=" flex justify-between">
                 <button 
                    className=" text-black hover:text-primary"
                    onClick={toggleCart}>
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <h2 className="text-xl font-semibold mb-4">عربة التسوق</h2>
            </div>
         
          <p className="text-center">عربتك للتسوق فارغة<br></br>
            يبدو أنك لم تقم بإضافة أي شيء إلى سلة التسوق الخاصة بك بعد.
            تفقد عروض اليوم والعروض المتاحة الآن للاستمتاع بالمزيد من التخفيضات.
            </p>
          
          {/* محتوى طويل لتجربة السكول */}
          <div className="align-items-center d-flex justify-content-center my-2 emptyCartImg_wrapper">
            <img src="https://img.freepik.com/free-vector/shopping-supermarket-cart-with-grocery-pictogram_1284-11697.jpg?ga=GA1.1.812912771.1724576833&semt=ais_hybrid" alt="" />
          </div>
          <Link to={'/CartLayout'}>ToPay</Link>

          {/* محاكاة محتوى طويل ليتجاوز ارتفاع النافذة */}
          <div style={{ height: '2000px' }}></div>
        </div>
      </div>
    </div>
  );
}
