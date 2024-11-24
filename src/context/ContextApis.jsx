import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "./LanguageContextPro"; // استيراد اللغة
import { useQuery } from "@tanstack/react-query";

export const ContextData = createContext();

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
    // console.log("Fetching data with lang:", language);
    const response = await axios.get(`https://tarshulah.com/api/home`, {
        headers: { lang: language },
    });
    return response.data;
}


async function getProdDetails(id, language) {
    const response = await axios.get(`https://tarshulah.com/api/product/show/${id}`, {
        headers: { lang: language },
    });
    // console.log(response.data);
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
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export default function DataContextProvider({ children }) {
    const { language } = useLanguage(); 
    const [userToken, setUserToken] = useState(() => {
        return localStorage.getItem("userToken") || null; // التهيئة من localStorage
    });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
     
      const {data:currency}=useQuery({
    queryKey:["getcurrency", language],
    queryFn: ()=> getCurrency(language),
  })
  let currencyData=currency?.data?.currency.currency_icon

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await subCategories(language);
                setData(response);
            } catch (error) {
                // console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [language]);

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
                setUserToken: handleSetUserToken,
                userToken,
                loading,
                data,
                currencyData,
            }}
        >
            {children}
        </ContextData.Provider>
    );
}
