import React, { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { baseUrl } from "../urls";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for(let index = 0; index < 300 +1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {

    const [all_product,setAll_Product] = useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());

    useEffect(()=>{
        fetch(`${baseUrl}/allproducts`)
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))
        
        //FINAL STEP CREATING ENDPOINT TO GET CARTDATA
        if(localStorage.getItem("auth-token")){
            fetch(`${baseUrl}/getcart`,{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    "auth-token":`${localStorage.getItem("auth-token")}`,
                    "Content-Type":"application/json",
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    },[])

    const addToCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        // console.log(cartItems);
        if(localStorage.getItem("auth-token")){
            fetch(`${baseUrl}/addtocart`,{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    "auth-token":`${localStorage.getItem("auth-token")}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem("auth-token")){
            fetch(`${baseUrl}/removefromcart`,{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    "auth-token":`${localStorage.getItem("auth-token")}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
            {
                if(cartItems[item]>0)
                    {
                        let itemInfo = all_product.find((product)=>product.id===Number(item));
                        totalAmount += itemInfo.new_price*cartItems[item];
                    }     
            } 
            return totalAmount;
    }

    const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems)
            {
                if(cartItems[item]>0)
                    {
                        totalItem += cartItems[item];
                    }
            }
            return totalItem;
    }
    
    const contextvalue = {getTotalCartAmount,getTotalCartItems,all_product,cartItems,addToCart,removeFromCart};
    return(
        <ShopContext.Provider value={contextvalue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;