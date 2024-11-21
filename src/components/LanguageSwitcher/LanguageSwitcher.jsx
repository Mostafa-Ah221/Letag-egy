import { useLanguage } from "../../context/LanguageContextPro";

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`
        px-4 
        py-2 
        rounded-lg 
        bg-primary
        text-white 
        hover:bg-orange-400
        transition-colors
        duration-200 
        ${language === "ar" ? "font-arabic" : "font-english"}
      `}
    >
      {language === "ar" ? "English" : "العربية"}
    </button>
  );
};

export default LanguageSwitcher;
