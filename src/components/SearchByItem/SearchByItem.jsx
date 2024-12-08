import React, { useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import axios from "axios";
import { useLocation } from 'react-router-dom';

function SearchByItem() {
    const { id } = useParams();
    const { subCategories, userData } = useContext(ContextData);
    const [searchData, setSearchData] = useState(null);
    const [searchData2, setSearchData2] = useState(null);
    const { language, toggleLanguage } = useLanguage();
    const { selectedTownId, setSelectedTownId } = useContext(ContextData);
    let filteredSuggestions = [];
    let filteredSuggestionsProducts = [];
    let location = useLocation();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["subCategory", language],
        queryFn: subCategories,
    });
    // useEffect(() => {
    //     console.log(location.pathname);
    //     const fetchData = async () => {
    //         console.log(id);
    //         if (id != "") {
    //             filteredSuggestions = data?.data.categories.filter((item) =>
    //                 item.name.toLowerCase().includes(id.toLowerCase()) // Case-insensitive matching
    //             );
    //             if (filteredSuggestions.length != 0) {
    //                 setSearchData(filteredSuggestions);
    //             }
    //             else {
    //                 setSearchData(null);
    //             }
    //         } else {
    //             setSearchData(null); // Clear suggestions if input is empty
    //         }
    //         if (id != "") {
    //             if (selectedTownId != "") {
    //                 const formData = new FormData();
    //                 formData.append("search", id);
    //                 formData.append("city_id", selectedTownId);
    //                 try {
    //                     const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
    //                         headers: { lang: language },
    //                     });
    //                     const resdata = await response.data;
    //                     const resproducts = await resdata.data.products;
    //                     filteredSuggestionsProducts = await resproducts;
    //                     console.log(filteredSuggestionsProducts);
    //                 } catch (error) {
    //                     console.error("Error fetching products:", error);
    //                 }

    //                 setSearchData2(filteredSuggestionsProducts);
    //             }
    //             else {
    //                 const formData = new FormData();
    //                 formData.append("search", id);
    //                 try {
    //                     const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
    //                         headers: { lang: language },
    //                     });
    //                     const resdata = await response.data;
    //                     const resproducts = await resdata.data.products;
    //                     filteredSuggestionsProducts = resproducts;
    //                 } catch (error) {
    //                     console.error("Error fetching products:", error);
    //                 }

    //                 setSearchData2(filteredSuggestionsProducts);
    //             }
    //         } else {
    //             setSearchData2(null);
    //         }
    //     }
    //     fetchData();
    // }, []);
    useEffect(() => {
        console.log(location.pathname);
        const fetchData = async () => {
            console.log(id);
            if (id != "") {
                filteredSuggestions = data?.data.categories.filter((item) =>
                    item.name.toLowerCase().includes(id.toLowerCase()) // Case-insensitive matching
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
            if (id != "") {
                if (selectedTownId != "") {
                    const formData = new FormData();
                    formData.append("search", id);
                    formData.append("city_id", selectedTownId);
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
                    formData.append("search", id);
                    try {
                        const response = await axios.post(`https://tarshulah.com/api/products`, formData, {
                            headers: { lang: language },
                        });
                        const resdata = await response.data;
                        const resproducts = await resdata.data.products;
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
        console.log(searchData2);
    }, [id]);

    return (
        <>
            {searchData.length != 0 ? <h1 className={`mx-2 my-2`}>{language === "ar" ? "الفئات" : "Categories"}</h1> : <></>}
            <div className={`grid grid-cols-4 gap-4 mx-2 my-2`}>
                {searchData ? searchData?.map((s) => (
                    <Link to={`/categoryDetails/${s.id}`} key={s.id}>
                        <div className='flex flex-col'>
                            <img src={s.photo} alt={s.title} className="w-18 h-18 block"></img>
                            <p>{s.name}</p>
                        </div>
                    </Link>
                )) : <></>}
            </div>
            <hr></hr>
            {searchData2.length != 0 ? <h1 className='mx-2 my-2'>{language === "ar" ? "المنتجات" : "Products"}</h1> : <></>}
            <div className='grid grid-cols-4 gap-4 mx-2 my-2'>
                {searchData2 ? searchData2?.map((s) => (
                    <Link to={`/productDetails/${s.id}`} key={s.id}>
                        <div className='flex flex-col'  >
                            <img src={s.photo} alt={s.title} className="w-18 h-18"></img>
                            <p>{s.title}</p>
                        </div>
                    </Link>
                )) : <></>}
            </div>
        </>
    )
}

export default SearchByItem;
