import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextData } from '../../context/ContextApis';
import { useQuery } from '@tanstack/react-query';

export default function Footer() {
  const { nameWebSite, getMenuPage,settings_domain } = useContext(ContextData);

  const { data } = useQuery({
    queryKey: ['getMenuPage'],
    queryFn: getMenuPage,
 
  });
  const logo = settings_domain?.data.logo

  const menuItems = data?.data.menu || [];
  const firstFourItems = menuItems.slice(0, 4); 
  const remainingItems = menuItems.slice(4);

  return (
    <>
      <footer className="bg-slate-100 py-10 mt-96 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <img
              className="w-32 h-auto object-cover"
              src={logo}
              alt="Letag Logo"
            />
            <p>إمتلك متجر الكتروني الأن كل الأدوات الممكنة في متناول يدك لإنشاء متجر الكتروني إحترافي مع لي تاج، بخطوات بسیطة وبدون أي خبرة تقنیة والبدء في البيع على الفور</p>
          </div>
          {/* Logo and About Section */}
          <div className=" ">
            <h3 className="text-lg font-semibold mb-4 text-primary">حول</h3>
            <ul className="space-y-2">
              {firstFourItems.map((item) => (
                <li key={item.id}>
                  <Link to={`/pagemenu/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Links */}
          <div className=" ">
            <h3 className="text-lg font-semibold mb-4 text-primary">روابط مفيدة</h3>
            <ul className="space-y-2">
              {remainingItems.map((item) => (
                <li key={item.id}>
                  <Link to={`/pagemenu/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
      {/* Footer Bottom */}
      <div className="flex mt-1 py-3 px-3 justify-between flex-row-reverse text-center text-sm bg-primary text-white">
        <p>
          &copy; 2024 {nameWebSite || 'Leetag'} All Rights Reserved |{' '}
          <a href="/terms" className="hover:underline">
            الشروط و الأحكام
          </a>
        </p>
        <p>
          Powered by{' '}
          <a href="https://egydesigner.com" className="hover:underline">
            EGYdesigner
          </a>
        </p>
      </div>
    </>
  );
}
