import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "./LanguageContextPro";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "./CartContext";

export const ContextData = createContext();

const baseDomain = window.location.protocol + "//" + window.location.hostname;
console.log(baseDomain);

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
async function getReviews(id, language) {
  const response = await axios.get(`https://tarshulah.com/api/reviews/${id}`, {
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


async function getOffers(language) {
  const response = await axios.get(`https://tarshulah.com/api/offers`, {
    headers: { lang: language },
  });
  // console.log(response.data);

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

async function getOrderDetails(id, language, token) {
  const response = await axios.get(
    `https://tarshulah.com/api/customer/order/show/${id}`,
    {
      headers: {
        Authorization: token,
        lang: language
      },
    }
  );
  return response.data;
}

async function getSlider(language) {
  const response = await axios.get(`https://tarshulah.com/api/sliders`, {
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
async function getMenuPage() {
  const response = await axios.get(`https://tarshulah.com/api/menu`);

  return response.data;
}
//todo ================================================================(getAddressList)=============//
const getAddressList = async (userToken, language) => {
  const token = userToken.startsWith("bearer") ? userToken : `Bearer ${userToken}`;

  try {
    const response = await fetch('https://tarshulah.com/api/customer/addresses', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token,
        lang: language
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};




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
  const { showToast } = useCart();
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem("userToken") || null;
  });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [addresses, setAddresses] = useState();
  const [selectedTownId, setSelectedTownId] = useState(null); // TODO for Stock

  const { data: settings } = useQuery({
    queryKey: ["getcurrency", language],
    queryFn: () => getCurrency(language),
  });
  //!================================================================(deleteAddress)=====================
  async function deleteAddress(id, userToken, language) {
    try {
      const response = await axios.post(
        `https://tarshulah.com/api/customer/address/delete/${id}`,
        {},
        {
          headers: {
            lang: language,
            Authorization: userToken,
          },
        }
      );

      // تحديث السياق
      setAddresses((prevAddresses) => prevAddresses.filter((address) => address.id !== id));
      showToast(language === 'ar' ? 'تم حذف العنوان بنجاح' : 'Address removed successfully');

      return response.data;
    } catch (error) {
      console.error("Error deleting address:", error);
      throw new Error(error.response?.data?.message || "Failed to delete address");
    }
  }
  async function getApiHome(language) {
    const response = await axios.get(`https://tarshulah.com/api/home`, {
      params: { city_id: selectedTownId },
      headers: { lang: language },
    });
    return response.data;
  }


  useEffect(() => {
    if (userToken) {
      getAddressList(userToken, language).then((data) => {
        if (data && data.data && Array.isArray(data?.data.addresses)) {
          setAddresses(data?.data?.addresses);
        } else {
          console.error("No addresses found in the response:", data);
        }
      }).catch(error => {
        console.error("Error fetching address list:", error);
      });
    }
  }, [userToken, language]);



  let currencyData = settings?.data?.currency.currency_icon;
  let currencyDataEnglish = settings?.data?.currency.currency_name;
  let settings_domain = settings;
  let colorWebSite = settings_domain?.data.theme_color;
  let nameWebSite = settings_domain?.data.shop_name;
  let isLanguage = settings_domain?.data?.languages.english;
  // let logoWebSite = settings_domain?.data.logo;
  // console.log(isLanguage.length);

  // =================================Web Site Color=======================================
  useEffect(() => {
    if (colorWebSite && nameWebSite) {
      document.documentElement.style.setProperty('--primary-color', colorWebSite);
      document.title = nameWebSite
    }
  }, [colorWebSite, nameWebSite]);

  // Fetch user data
  function fetchUserData() {
    if (!userToken) return;
    axios
      .get(`https://demo.leetag.com/api/customer/profile`, {
        headers: { Authorization: `${userToken}` },
      })
      .then((response) => {
        const user = {
          name: response.data.data.customer.first_name,
          last_name: response.data.data.customer.last_name,
          email: response.data.data.customer.email,
          phone: response.data.data.customer.phone,
          points: response.data.data.customer.avaliable_points
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
        getOffers: () => getOffers(language),
        getSlider: () => getSlider(language),
        getProdDetails: (id) => getProdDetails(id, language),
        getOrderDetails: (id) => getOrderDetails(id, language),
        deleteAddress: (id) => deleteAddress(id, userToken, language),
        getCategoriesDetails: (id) => getCategoriesDetails(id, language),
        getProductCategory: (idCategory, page, pageSize) =>
          getProductCategory(idCategory, page, pageSize, language),
        fetchProducts: (filters) => fetchProducts(filters, language),
        getReviews: (id, language) => getReviews(id, language),
        getMenuPage,
        setUserToken: handleSetUserToken,
        userToken,
        userData,
        setUserData,
        loading,
        data,
        currencyData,
        currencyDataEnglish,
        settings_domain,
        setSelectedTownId,
        selectedTownId,
        colorWebSite,
        nameWebSite,
        getAddressList,
        setAddresses,
        addresses,
        isLanguage
      }}
    >
      {children}
    </ContextData.Provider>
  );
}
