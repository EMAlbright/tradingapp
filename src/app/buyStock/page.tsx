"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BuyStockPage() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchStockPrice = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API!}`);
            const data = await response.json();
            setPrice(data.c);
        } catch (error) {
            console.error("Failed to fetch stock price", error);
            toast.error("Failed to fetch stock price");
        } finally {
            setLoading(false);
        }
    };

    const onBuyStock = async() => {
        try{
            setLoading(true);
            const response = await axios.post("/api/buyStock", {symbol, quantity, price})
            toast.success("Stock purchased!")
            router.push("/home")
        }
        catch(error: any){
            toast.error(error.response?.data?.error || "Stock purchase failed");
        } finally{
            setLoading(false);
        }
    }
}