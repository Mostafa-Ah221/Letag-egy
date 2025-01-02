// LanguageContextPro.jsx
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// إنشاء Context لإدارة اللغة
const LanguageContext = createContext();

// مكون الـ Provider
export const LanguageContextPro = ({ children }) => {
  const [language, setLanguage] = useState("ar"); // اللغة الافتراضية: "ar"

  // تبديل اللغة
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ar" ? "en" : "ar"));
  };

  useEffect(() => {
    axios.defaults.headers.common["lang"] = language; // تحديث Axios
    document.documentElement.setAttribute("lang", language); // تحديث سمة "lang"
  }, [language]);

  // توفير اللغة ودالة التبديل لجميع المكونات
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// هوك لاستخدام السياق بسهولة
export const useLanguage = () => useContext(LanguageContext);
