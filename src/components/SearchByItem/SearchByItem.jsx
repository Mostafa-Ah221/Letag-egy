import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import axios from "axios";

function SearchByItem() {
    const { search, city_id } = useParams();
    const { subCategories, userData } = useContext(ContextData);
    const [searchData, setSearchData] = useState(null);
    const [searchData2, setSearchData2] = useState(null);
    const { language, toggleLanguage } = useLanguage();
    let filteredSuggestions = [];
    let filteredSuggestionsProducts = [];
    const { data, isLoading, isError } = useQuery({
        queryKey: ["subCategory", language],
        queryFn: subCategories,
    });
    useEffect(() => {
        const fetchData = async () => {
            if (search != "") {
                filteredSuggestions = data?.data.categories.filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()) // Case-insensitive matching
                );
                if (filteredSuggestions.length != 0) {
                    setSearchData(filteredSuggestions);
                }
                else {
                    setSearchData(null);
                }
            } else {
                setSearchData(null); // Clear suggestions if input is empty
            }
            if (search != "") {
                if (city_id != "") {
                    const formData = new FormData();
                    formData.append("search", search);
                    formData.append("city_id", city_id);
                    try {
                        const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
                            headers: { lang: language },
                        });
                        const resdata = await response.data;
                        const resproducts = await resdata.data.products;
                        filteredSuggestionsProducts = await resproducts;
                        console.log(filteredSuggestionsProducts);
                    } catch (error) {
                        console.error("Error fetching products:", error);
                    }

                    setSearchData2(filteredSuggestionsProducts);
                }
                else {
                    const formData = new FormData();
                    formData.append("search", search);
                    formData.append("city_id", "");
                    try {
                        const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
                            headers: { lang: language },
                        });
                        const resdata = await response.data;
                        const resproducts = await resdata.products;
                        filteredSuggestionsProducts = resproducts;
                    } catch (error) {
                        console.error("Error fetching products:", error);
                    }

                    setSearchData2(filteredSuggestionsProducts);
                }
            } else {
                setSearchData2(null);
            }
        }
        fetchData();
    }, []);

    return (
        <>

        </>
    )
}

export default SearchByItem;
