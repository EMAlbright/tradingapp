'use client';

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BuyStockPage() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState<number | null>(null);
    const [takeProfitPrice, setTakeProfitPrice] = useState<number | null>(null);
    const [stopLossPrice, setStopLossPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * 
                <input
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
                    type="number"
                    min="1"
                    placeholder="Enter a Take Profit Price"
                    value={takeProfitPrice || ""}
                    onChange={(e) => setTakeProfitPrice(Number(e.target.value))}
                />

                <input
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
                    type="number"
                    min="1"
                    placeholder="Enter a Stop Loss Price"
                    value={stopLossPrice || ""}
                    onChange={(e) => setStopLossPrice(Number(e.target.value))}
                />
     */

    const fetchStockPrice = async () => {
        try {  
            setLoading(true);
            const key = process.env.NEXT_PUBLIC_FINNHUB_API;
            //fix key later
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`);
            const data = await response.json();
            setPrice(data.c);
        } catch (error) {
            console.error("Failed to fetch stock price", error);
            toast.error("Failed to fetch stock price");
        } finally {
            setLoading(false);
        }
    };

    const onBuyStock = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/buyStock", { symbol, quantity, price });
            toast.success("Stock purchased!");
            router.push("/home");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Stock purchase failed");
        } finally {
            setLoading(false);
        }
    };

    const onSellStock = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/sellStock", { symbol, quantity });
            toast.success("Stock sold!");
            router.push("/home");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Stock sale failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Satire Trade</h1>
                <input
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
                    type="text"
                    placeholder="Enter a ticker"
                    value={symbol.toUpperCase()}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
                <button
                    onClick={fetchStockPrice}
                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get Price'}
                </button>
                {price !== null && (
                    <div className="text-center">
                        <p>Current Price for {symbol}: ${price}</p>
                    </div>
                )}
                <input
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
                    type="number"
                    min="1"
                    placeholder="Enter a quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />                
                <button
                    onClick={onBuyStock}
                    className="w-full p-2 bg-green-600 hover:bg-green-700 rounded-lg"
                    disabled={loading}
                >
                    Buy Stock
                </button>
                <button
                    onClick={onSellStock}
                    className="w-full p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                    disabled={loading}
                >
                    Sell Stock
                </button>
            </div>
        </div>
    );
}
