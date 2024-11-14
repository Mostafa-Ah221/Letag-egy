import axios from "axios";
import { createContext, useState } from "react";

export const ContextData=createContext()
 
async function subCategories(){
    const response=await axios.get(`https://tarshulah.com/api/categories`)
        return response.data;
}
async function getCategoriesDetails(id) {
    const response = await axios.get(`https://tarshulah.com/api/categories`, {
       params: { id: id }
    });
    return response.data;
}

async function getBrands(){
    const response=await axios.get(`https://tarshulah.com/api/brands`)
        return response.data;
}
async function getApiHome(){
    const response=await axios.get(`https://tarshulah.com/api/home`)
        return response.data;
}
async function getProdDetails(id) {
    const response = await axios.get(`https://tarshulah.com/api/home`, {
       params: { id: id }
    });
    return response.data;
}

async function getٍSlider(){
    const response=await axios.get(`http://demo.leetag.com/api/sliders`)
        return response.data;
}
async function getProductCategory(idCategory, page, pageSize) {
    try {
        const response = await axios.get(
            `https://tarshulah.com/api/category/products/${idCategory}`,
            {
                params: { page, pageSize }
            }
        );
        
        console.log('Response Data:', response.data);  
        return response.data; 
    } catch (error) {
        console.error('Error fetching products:', error); 
        throw error; 
    }
}





 export default function DataContextProveder({children}){
        const [userToken, setUserToken] = useState(null)
    
    return <ContextData.Provider value={{subCategories,getBrands,getApiHome,getٍSlider,getProdDetails,getCategoriesDetails,getProductCategory,setUserToken,userToken}}>
        {children}
    </ContextData.Provider>
 }

