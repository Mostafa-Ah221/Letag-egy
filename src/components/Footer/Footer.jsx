import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <> 
    <footer className="bg-[#5e5d5a] text-white py-10 mt-11 px-4">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-sm">

        {/* Logo and About Section */}
        <div className='order-4 text-right'>
          <h3 className="text-lg font-semibold mb-4 text-primary">ليتاج</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:underline">عن ليتاج</Link></li>
            <li><a href="#" className="hover:underline">من نحن</a></li>
            <li><a href="/contact" className="hover:underline">تواصل معنا</a></li>
            <li><a href="#" className="hover:underline">سياسة الاستبدال و الاسترجاع</a></li>
            <li><a href="#" className="hover:underline">الأحكام والشروط</a></li>
          </ul>
        </div>

        <div className='order-3 text-right'>
          <h3 className="text-lg font-semibold mb-4 text-primary">الأكثر بحثاً علي ليتاج</h3>
          <ul className="space-y-2">
            <li><a href="/materials" className="hover:underline">مواد البناء</a></li>
            <li><a href="/mixers" className="hover:underline">خلاطات</a></li>
            <li><a href="/plumbing" className="hover:underline">صحي</a></li>
            <li><a href="/electric-supplies" className="hover:underline">مستلزمات كهرباء</a></li>
            <li><a href="/paints" className="hover:underline">دهانات</a></li>
          </ul>
        </div>

        {/* Payment Options */}
        <div className='order-2 text-right'>
          <h3 className="text-lg font-semibold mb-4 text-primary">خيارات السداد</h3>
          <ul className="space-y-2 grid grid-cols-2 md:grid-cols-3 relative left-11">
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/aman-70-701692272507.png" alt="" /></li>
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/visa1696171284.png" alt="" /></li>
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/valu-70-701692272526.png" alt="" /></li>
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/instapay-70-701692272567.png" alt="" /></li>
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/faway-70-701692272621.png" alt="" /></li>
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/forsa1694354605.png" alt="" /></li>
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/souhoola1716377187.png" alt="" /></li>
            <li><img src="https://e-motion-cdn.fra1.cdn.digitaloceanspaces.com/uploads/media-uploader/master-card1696171284.png" alt="" /></li>
      
          </ul>
        </div>
     <div className='order-1'>

      <div className="container mx-auto text-right space-y-4 ">
        <h3 className="text-lg font-semibold text-primary">تابعنا </h3>
        <div className="container mx-auto flex justify-end space-x-6 mt-10">
        <a href="https://facebook.com" className="hover:text-blue-600"><FaFacebook className='text-2xl' /></a>
        <a href="https://instagram.com" className="hover:text-pink-500"><FaInstagram className='text-2xl'/></a>
        <a href="https://twitter.com" className="hover:text-blue-400"><FaTwitter className='text-2xl'/></a>
        <a href="https://linkedin.com" className="hover:text-blue-700"><FaLinkedin className='text-2xl'/></a>
      </div>
      <h3 className="text-lg font-semibold text-primary">تابع نشرتنا الإخبارية</h3>
        <div className="flex justify-center items-center space-x-4">
          <input
            type="email"
            placeholder="ادخل الايميل"
            className="px-4 py-2 rounded-md border border-gray-300 text-black"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-md">اشترك</button>
        </div>
        <div className="flex justify-center space-x-6 text-2xl mt-4">
          <a href="https://play.google.com" className="hover:text-gray-400">Google App</a>
          <a href="https://apple.com" className="hover:text-gray-400">Apple App</a>
        </div>
      </div>

      
     </div>
      </div>
       <div className=' text-right mx-4'>
          <h3 className="text-lg font-semibold mb-4 text-primary">تواصل معنا</h3>
          <ul className="space-y-2">
            <li><strong>Hotline:</strong> 01203100588</li>
            <li><strong>للتواصل:</strong> 01211117114</li>
            <li><strong>للتصدير:</strong> 01203100919</li>
          </ul>
        </div>
      

      {/* Footer Bottom */}
      
    </footer>
    <div className="flex py-3 px-3 justify-between flex-row-reverse text-center text-sm bg-primary text-white">
        <p>&copy; 2024 Leetag All Rights Reserved | <a href="/terms" className="hover:underline">الشروط و الأحكام</a></p>
        <p>Powered by <a href="https://egydesigner.com" className="hover:underline">EGYdesigner</a></p>
      </div>
    </>
   
  );
}
