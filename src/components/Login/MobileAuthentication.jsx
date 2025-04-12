import { useContext, useState } from 'react';
import { ArrowRight, Lock, Phone, CheckCircle, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContextPro';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ContextData } from '../../context/ContextApis';

const MobileAuthentication = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [codePhone, setCodePhone] = useState(''); // حقل code_phone
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [currentStep, setCurrentStep] = useState('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { language } = useLanguage();
  const { showToast } = useCart();
  const navigate = useNavigate();
  const { setUserToken, api_key } = useContext(ContextData);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // API call to send verification code
    axios.post(
      'https://tarshulah.com/api/customer/login',
      {
        phone: phoneNumber,
        // code_phone: codePhone, // إضافة code_phone هنا
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          APP_KEY: api_key,
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        setCurrentStep('verification');
        showToast(language === "ar" ? "تم إرسال رمز التحقق بنجاح" : "Verification code sent successfully");
      })
      .catch((error) => {
        setIsLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          (language === "ar" ? "حدث خطأ أثناء إرسال رمز التحقق" : "Error sending verification code");
        setErrorMsg(errorMessage);
        showToast(errorMessage, 'error');
      });
  };

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value !== '' && !/^\d+$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Get the full code from verification code array
    const code = verificationCode.reverse().join('');

    // API call to verify code
    axios.post(
      'https://tarshulah.com/api/customer/verify/check',
      {
        phone: phoneNumber,
        verify_code: code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          APP_KEY: api_key,
        },
      }
    )
      .then((response) => {
        setIsLoading(false);

        // Extract token from response
        const tokenUser =
          response.data?.data?.access_token ||
          response.data?.data?.user.original.access_token ||
          response.data?.token;

        if (tokenUser) {
          // Save token and redirect
          localStorage.setItem("userToken", tokenUser);
          setUserToken(tokenUser);
          navigate('/');
          showToast(language === "ar" ? "تم التحقق بنجاح!" : "Successfully verified!");
        } else {
          // No token found
          const errorMessage = language === "ar" ? "خطأ في استخراج التوكن" : "Error extracting token";
          setErrorMsg(errorMessage);
          showToast(errorMessage, 'error');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          (language === "ar" ? "حدث خطأ أثناء التحقق من الرمز" : "Error verifying code");
        setErrorMsg(errorMessage);
        showToast(errorMessage, 'error');
      });
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setVerificationCode(['', '', '', '']);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentStep === 'phone' ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">{language === "ar" ? "تسجيل دخول" : "Sign In"}</h1>
                <p className="text-gray-600 mt-2">{language === "ar" ? "أدخل رقم هاتفك المحمول للمتابعة" : "Enter your mobile number to continue"}</p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                {/* حقل رقم الهاتف */}
                <div className="space-y-2">
                    {/* حقل رقم الهاتف */}
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {language === "ar" ? "رقم الهاتف المحمول" : "Mobile Phone Number"}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="tel"
                        id="phone"
                        className={`block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                        placeholder={language === "ar" ? "أدخل رقم هاتفك" : "Enter your phone number"}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        dir={language === "ar" ? "rtl" : "ltr"} 
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === "ar" ? "جاري الإرسال..." : "Sending..."}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>{language === "ar" ? "إرسال رمز التحقق" : "Send Verification Code"}</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-gray-50 px-8 py-6">
              <p className="text-sm text-gray-600 text-center">
                {language === "ar" ? (
                  <>
                    ليس لديك حساب؟{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                      إنشاء حساب
                    </Link>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Create an account
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <button
                onClick={handleBackToPhone}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </button>

              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">{language === "ar" ? "تحقق من الهاتف" : "Phone Verification"}</h1>
                <p className="text-gray-600 mt-2">
                  {language === "ar" ? "تم إرسال رمز التحقق إلى" : "Verification code has been sent to"} {phoneNumber}
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-center">
                    {language === "ar" ? "أدخل رمز التحقق المكون من 4 أرقام" : "Enter the 4-digit verification code"}
                  </label>
                  <div className="flex justify-center space-x-2">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && digit === '' && index > 0) {
                            const prevInput = document.getElementById(`code-${index - 1}`);
                            if (prevInput) prevInput.focus();
                          }
                        }}
                        required
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading || verificationCode.some(digit => digit === '')}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === "ar" ? "جاري التحقق..." : "Verifying..."}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>{language === "ar" ? "تأكيد الرمز" : "Confirm Code"}</span>
                      <CheckCircle className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAuthentication;