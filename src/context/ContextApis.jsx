import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "./LanguageContextPro";
import { useQuery } from "@tanstack/react-query";

export const ContextData = createContext();

async function fetchProducts(filters, language) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(filters)) {
    formData.append(key, value);
  }
  try {
    const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
      headers: { lang: language },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

async function subCategories(language) {
  const response = await axios.get(`https://tarshulah.com/api/categories`, {
    headers: { lang: language },
  });
  return response.data;
}

async function getCategoriesDetails(id, language) {
  const response = await axios.get(`https://tarshulah.com/api/categories`, {
    params: { id: id },
    headers: { lang: language },
  });
  return response.data;
}

async function getBrands(language) {
  const response = await axios.get(`https://tarshulah.com/api/brands`, {
    headers: { lang: language },
  });
  return response.data;
}

async function getApiHome(language) {
  const response = await axios.get(`https://tarshulah.com/api/home`, {
    headers: { lang: language },
  });
  return response.data;
}

async function getProdDetails(id, language) {
  const response = await axios.get(
    `https://tarshulah.com/api/product/show/${id}`,
    {
      headers: { lang: language },
    }
  );
  return response.data;
}

async function getSlider(language) {
  const response = await axios.get(`http://demo.leetag.com/api/sliders`, {
    headers: { lang: language },
  });
  return response.data;
}

async function getCurrency(language) {
  const response = await axios.get(`https://tarshulah.com/api/domain/settings`, {
    headers: { lang: language },
  });
  return response.data;
}

async function getProductCategory(idCategory, page, pageSize, language) {
  try {
    const response = await axios.get(
      `https://tarshulah.com/api/category/products/${idCategory}`,
      {
        params: { page, pageSize },
        headers: { lang: language },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}



export default function DataContextProvider({ children }) {
  const { language } = useLanguage();

  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem("userToken") || null;
  });

  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedTownId, setSelectedTownId] = useState(''); // TODO for Stock

  const { data: settings } = useQuery({
    queryKey: ["getcurrency", language],
    queryFn: () => getCurrency(language),
  });

  let currencyData = settings?.data?.currency.currency_icon;
  let settings_domain = settings;

  // Fetch user data
  function fetchUserData() {
    if (!userToken) return; 

    axios
      .get(`https://demo.leetag.com/api/customer/profile`, {
        headers: { Authorization: `${userToken}` },
      })
      .then((response) => {
        //   console.log("API Response:", response.data.data.customer); 
        const user = {
          name: response.data.data.customer.first_name,
          email: response.data.data.customer.email,
        };
        setUserData(user); 
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }

  // Fetch subcategories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await subCategories(language);
        setData(response);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Fetch user data when userToken changes
  useEffect(() => {
    fetchUserData();
  }, [userToken]);

  const handleSetUserToken = (token) => {
    if (token) {
      localStorage.setItem("userToken", token);
    } else {
      localStorage.removeItem("userToken");
    }
    setUserToken(token);
  };

  return (
    <ContextData.Provider
      value={{
        subCategories: () => subCategories(language),
        getBrands: () => getBrands(language),
        getApiHome: () => getApiHome(language),
        getSlider: () => getSlider(language),
        getProdDetails: (id) => getProdDetails(id, language),
        getCategoriesDetails: (id) => getCategoriesDetails(id, language),
        getProductCategory: (idCategory, page, pageSize) =>
          getProductCategory(idCategory, page, pageSize, language),
        fetchProducts: (filters) => fetchProducts(filters, language), 
        setUserToken: handleSetUserToken,
        userToken,
        userData,
        setUserData,
        loading,
        data,
        currencyData,
        settings_domain,
        setSelectedTownId,
        selectedTownId
      }}
    >
      {children}
    </ContextData.Provider>
  );
}
