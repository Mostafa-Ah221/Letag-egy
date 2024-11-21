import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const LanguageContext = createContext();

export const LanguageContextPro = ({ children }) => {
  const [language, setLanguage] = useState("ar"); 

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ar" ? "en" : "ar"));
  };

  useEffect(() => {
    axios.defaults.headers.common["lang"] = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
