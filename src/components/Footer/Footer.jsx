import { useContext } from "react";
import { Link } from "react-router-dom";
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";

export default function Footer() {
  const { nameWebSite, getMenuPage, settings_domain } = useContext(ContextData);
  const { language } = useLanguage();

  const { data } = useQuery({
    queryKey: ["getMenuPage"],
    queryFn: getMenuPage,
  });

  const logo = settings_domain?.data.logo;
  const socials = settings_domain?.data.socials;

  const menuItems = data?.data.menu || [];

  const columns = [];
  const itemsPerColumn = 4;
  for (let i = 0; i < menuItems.length; i += itemsPerColumn) {
    columns.push(menuItems.slice(i, i + itemsPerColumn));
  }

  return (
    <>
      <footer className="bg-slate-100 py-10 px-4">
        <div
          className={`container mx-auto grid ${
            columns.length > 3 ? "grid-rows-2" : "grid-rows-1"
          } md:grid-cols-3 gap-8 text-sm`}
        >
          {/* القسم الأول: اللوجو والمعلومات */}
          <div>
            <img
              className="w-32 mb-7 h-auto object-cover"
              src={logo}
              alt="Leetag Logo"
            />
            <p className="text-[1rem] text-[#888] leading-6">
              {language === "ar"
                ? "إمتلك متجر الكتروني الأن كل الأدوات الممكنة في متناول يدك لإنشاء متجر الكتروني إحترافي مع لي تاج، بخطوات بسیطة وبدون أي خبرة تقنیة والبدء في البيع على الفور"
                : "Own an online store now! All the tools you need are at your fingertips to create a professional online store with Leetag. With simple steps and no technical expertise required, you can start selling immediately!"}
            </p>
            <div>
              <ul className="flex gap-4 mt-4">
                {Array.isArray(socials) && socials.length > 0 ? (
                  socials.map((social, index) => (
                    <li className="w-9 h-9 rounded-full" key={index}>
                      {social.icon}
                    </li>
                  ))
                ) : (
                  [1, 2, 3, 4].map((_, index) => (
                    <li
                      key={index}
                      className="w-9 h-9 rounded-full bg-gray-300"
                    ></li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* الأعمدة الديناميكية */}
          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              className={`text-center ${
                colIndex > 2 ? "row-start-2" : ""
              }`} // الأعمدة الزائدة تبدأ في صف جديد
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">
                {colIndex === 0
                  ? language === "ar"
                    ? "حول"
                    : "About"
                  : colIndex === 1
                  ? language === "ar"
                    ? "روابط مفيدة"
                    : "Useful Links"
                  : language === "ar"
                  ? "روابط إضافية"
                  : "Additional Links"}
              </h3>
              <ul className="space-y-2">
                {column.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/pagemenu/${item.id}`}
                      className="hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>

      {/* Footer Bottom */}
      <div className="flex mt-1 py-3 px-3 justify-between flex-row-reverse text-center text-sm bg-primary text-white">
        <p>
          &copy; 2024 {nameWebSite || "Leetag"} All Rights Reserved {""}
        </p>
        <p>
          Powered by{" "}
          <a href="https://egydesigner.com" className="hover:underline">
            EGYdesigner
          </a>
        </p>
      </div>
    </>
  );
}
