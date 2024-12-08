import React, { useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContextData } from "../../context/ContextApis";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContextPro";
import axios from "axios";
<<<<<<< HEAD
import { IoEyeSharp } from 'react-icons/io5';
import { IoIosHeart } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { useCart } from '../../context/CartContext';
=======
import { useLocation } from 'react-router-dom';
>>>>>>> 377ff4a012d9f70d7050e19e6d2baecd691f4418

function SearchByItem() {
    const { id } = useParams();
    const { subCategories, userData } = useContext(ContextData);
    const [searchData, setSearchData] = useState(null);
    const [searchData2, setSearchData2] = useState(null);
      const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
    const { language, toggleLanguage } = useLanguage();
    const { selectedTownId, setSelectedTownId } = useContext(ContextData);
    const [quantity, setQuantity] = useState(1);
  const { addToCart, handleAddToWish,wishList  } = useCart();
    let filteredSuggestions = [];
    let filteredSuggestionsProducts = [];
    let location = useLocation();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["subCategory", language],
        queryFn: subCategories,
    });
<<<<<<< HEAD
     const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };
//   const handleAddToCart = (product) => {
//     addToCart(product, quantity); 
//   };

=======
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
>>>>>>> 377ff4a012d9f70d7050e19e6d2baecd691f4418
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
                            <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-t-lg">
                {s.photo && (
                  <div className="group h-48 overflow-hidden">
                    <img
                      src={s?.photo}
                      alt={s.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="z-20">
                        <IoEyeSharp onClick={(e) => { e.preventDefault(); handleProductClick(s); }} className="text-white bg-primary p-2 rounded-full text-[2.4rem]" />
                      </button>
                      <button className="z-20">
                        <button
                    onClick={(e) => {
                      e.preventDefault();
                      const isInWishList = wishList.some(
                        (wishItem) => wishItem && wishItem.id === s.id
                      );
                      handleAddToWish(s, isInWishList, () => {});
                    }}
                    className="z-20"
                  >
                    {wishList.some(
                      (wishItem) => wishItem && wishItem.id === s.id
                    ) ? (
                      <IoIosHeart className="text-primary text-[2.5rem]" />
                    ) : (
                      <CiHeart className="text-primary text-5xl" />
                    )}
                  </button>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
