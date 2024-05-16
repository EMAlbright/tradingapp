"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { NextResponse } from "next/server";

export default function BuyStockPage() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchStockPrice = async () => {
        try {  
            setLoading(true);
            const key = process.env.NEXT_PUBLIC_FINNHUB_API;
            //fix key later
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`);
            const data = await response.json();
            console.log(data.c);
            setPrice(data.c);
        } catch (error) {
            console.error("Failed to fetch stock price", error);
            toast.error("Failed to fetch stock price");
        } finally {
            setLoading(false);
        }
    };

    const onSellStock = async() => {
        //check if user has symbol in a position
    // check if user has the quantity or less than in position
    // if true, execute trade
        try{
            setLoading(true);
        }
        catch(error: any){
            return toast.error(error.response?.data?.error || "Stock purchase failed");

        }
    }

    const onBuyStock = async() => {
        try{
            setLoading(true);
            const response = await axios.post("/api/users/buyStock", {symbol, quantity, price})
            toast.success("Stock purchased!")
            router.push("/home")
        }
        catch(error: any){
            toast.error(error.response?.data?.error || "Stock purchase failed");
        } finally{
            setLoading(false);
        }
    }

    return(
        <div className="mainContainer">
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4"
            type="text"
            placeholder="Enter a ticker"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            />
            <button onClick={fetchStockPrice}
            className="p-2 border border-gray-300 rounded-lg mb-4">
                Get Price
            </button>
            </div>
            <div className="p-2 border border-gray-300 rounded-lg mb-4">
                <p>Current Price for {symbol}: ${price}</p>
                    <input 
                    type="number"
                    min="1"
                    placeholder="Enter a quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <button
                        onClick={onBuyStock}
                        className="p-2 border border-gray-300 rounded-lg mb-4"
                    >
                    Buy Stock
                    </button>
            </div>
        </div>
    )
}