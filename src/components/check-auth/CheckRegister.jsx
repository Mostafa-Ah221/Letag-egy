import { useContext, useState } from "react";
import { ContextData } from "../../context/ContextApis";
import SignUp from "../SignUp/SignUp";
import MobileSignup from "../SignUp/MobileSignup";
import LoadingIndicator from "../Loading/LoadingIndicator";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckRegister() {
  const { registr_system } = useContext(ContextData);
  const [loading, setLoading] = useState(false);
  const [errorMas, setErrorMas] = useState("");
  const { showToast } = useCart();
  const { api_key } = useContext(ContextData);
  let navigate = useNavigate();

  function handleRegister(values) {
    setLoading(true);
    axios
      .post(`https://tarshulah.com/api/customer/register`, values, {
        headers: { APP_KEY: api_key }
      })
      .then((apiResponse) => {
        setLoading(false);
        navigate('/login');
        showToast(apiResponse.data.message);
      })
      .catch((apiResponse) => {
        setLoading(false);
        setErrorMas(apiResponse.response.data.message);
        showToast(apiResponse.response.data.errors);
      });
  }

  if (!registr_system) {
    return <LoadingIndicator />;
  }

  if (registr_system === "default") {
    return (
      <SignUp
        handleRegister={handleRegister}
        loading={loading}
        errorMas={errorMas}
      />
    );
  }
  
  if (registr_system === "phone") {
    return (
      <MobileSignup
        handleRegister={handleRegister}
        loading={loading}
        errorMas={errorMas}
      />
    );
  }

  return null;
}