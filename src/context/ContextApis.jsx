import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "./LanguageContextPro";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "./CartContext";

export const ContextData = createContext();


let api_key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"

async function fetchProducts(filters, language, selectedTownId, cityData) {
  const body = {
    ...filters,
  };

  // التأكد من إضافة city_id
  if (cityData) {
    body.city_id = cityData;
  } else if (selectedTownId) {
    body.city_id = selectedTownId;
  }

  console.log("Request Body before sending:", body); // التأكد من بيانات الـ body قبل الإرسال

  try {
    // التأكد من إرسال الـ request
    const response = await axios.post("https://tarshulah.com/api/products", body, {
      headers: {
        lang: language,
        APP_KEY: api_key,
        "Content-Type": "application/json",
      },
    });
    
    // التأكد من رد الـ API
    console.log("API Response:", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}


async function subCategories(language, selectedTownId, cityData) {
  const response = await axios.get(`https://tarshulah.com/api/categories`, {
    params: {city_id: selectedTownId || cityData },
    headers: { lang: language, APP_KEY:api_key },
  });
  // console.log(response?.data);
  
  return response.data;
}

async function getCategoriesDetails(id, language, selectedTownId, cityData) {
  const response = await axios.get(`https://tarshulah.com/api/categories`, {
    params: { id: id, city_id: selectedTownId || cityData },
    headers: { lang: language , APP_KEY:api_key},
  });
  return response.data;
}
async function getReviews(id, language) {
  const response = await axios.get(`https://tarshulah.com/api/reviews/${id}`, {
    headers: { lang: language, APP_KEY:api_key },
  });
  return response.data;
}

async function getBrands(language) {
  const response = await axios.get(`https://tarshulah.com/api/brands`, {
    headers: { lang: language , APP_KEY:api_key},
  });
  return response.data;
}


async function getOffers(language) {
  const response = await axios.get(`https://tarshulah.com/api/offers`, {
    headers: { lang: language , APP_KEY:api_key},
  });
  // console.log(response.data);

  return response.data;
}

async function getProdDetails(id, language) {
  const response = await axios.get(
    `https://tarshulah.com/api/product/show/${id}`,
    {
      headers: { lang: language , APP_KEY:api_key},
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
        lang: language,
       APP_KEY:api_key
      },
    }
  );
  return response.data;
}

async function getSlider(language) {
  const response = await axios.get(`https://tarshulah.com/api/sliders`, {
    headers: { lang: language, APP_KEY:api_key},
  });
  return response.data;
}

async function getCurrency(language) {
  const response = await axios.get(`https://tarshulah.com/api/domain/settings`, {
    headers: { lang: language , APP_KEY:api_key},
  });

  return response.data;
}
async function getMenuPage() {
  const response = await axios.get(`https://tarshulah.com/api/menu`,{
    headers: { APP_KEY:api_key},
  });
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
        , APP_KEY:api_key
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
        headers: { lang: language , APP_KEY:api_key},
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
    const [cityData, setCityData] = useState(null);
  

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
             APP_KEY:api_key
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
  async function getApiHome(language, selectedTownId, cityData) {
  let requestConfig = {
    headers: { lang: language, APP_KEY: api_key },
    params: {}
  };

  if (cityData?.city_id !== undefined && cityData?.city_id !== null) {
    requestConfig.params.city_id = cityData.city_id;
  } else if (selectedTownId !== undefined && selectedTownId !== null) {
    requestConfig.params.city_id = selectedTownId;
  }

  const response = await axios.get(`https://tarshulah.com/api/home`, requestConfig);
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



  let currencyData = settings?.data?.currency;
  // let currencyDataEnglish = settings?.data?.currency.currency_name;
  let settings_domain = settings;
  let colorWebSite = settings_domain?.data.theme_color;
  let nameWebSite = settings_domain?.data.shop_name;
  let isLanguage = settings_domain?.data?.languages.english;
  let registr_system=settings_domain?.data?.registration_system
  let map_key=settings_domain?.data?.google_map_key
  let min_order=settings_domain?.data?.min_order
  let shop_description=settings_domain?.data?.shop_description
  let points_system=settings_domain?.data?.points_system
  
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
      .get(`https://tarshulah.com/api/customer/profile`, {
        headers: { Authorization: `${userToken}`, APP_KEY:api_key },
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
        subCategories: () => subCategories(language, selectedTownId, cityData),
        getBrands: () => getBrands(language),
        getApiHome: () => getApiHome(language, selectedTownId, cityData),
        getOffers: () => getOffers(language),
        getSlider: () => getSlider(language),
        getProdDetails: (id) => getProdDetails(id, language),
        getOrderDetails: (id) => getOrderDetails(id, language),
        deleteAddress: (id) => deleteAddress(id, userToken, language),
        getCategoriesDetails: (id) => getCategoriesDetails(id, language),
        getProductCategory: (idCategory, page, pageSize) =>
        getProductCategory(idCategory, page, pageSize, language,cityData),
        fetchProducts: (filters) => fetchProducts(filters, language, selectedTownId, cityData),
        getReviews: (id, language) => getReviews(id, language),
        getMenuPage,
        setUserToken: handleSetUserToken,
        userToken,
        userData,
        setUserData,
        loading,
        data,
        currencyData,
        settings_domain,
        setSelectedTownId,
        selectedTownId,
        colorWebSite,
        nameWebSite,
        getAddressList,
        setAddresses,
        addresses,
        isLanguage,
        api_key,
        shop_description,
        registr_system,
        points_system,
        map_key,
        min_order,
        cityData,
        setCityData
      }}
    >
      {children}
    </ContextData.Provider>
  );
}
