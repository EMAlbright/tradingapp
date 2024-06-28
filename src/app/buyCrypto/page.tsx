'use client';

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BuyCryptoPage() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchCryptoPrice = async () => {
        try {  
            setLoading(true);
            //fix key later
            const response = await fetch(`https://api.coincap.io/v2/assets/${symbol}`);
            const data = await response.json();
            setPrice(parseFloat(parseFloat(data.data.priceUsd).toFixed(2)));
        } catch (error) {
            console.error("Failed to fetch crypto price", error);
            toast.error("Failed to fetch crypto price");
        } finally {
            setLoading(false);
        }
    };

    const onBuyCrypto = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/buyCrypto", { symbol, quantity, price });
            toast.success("Crypto purchased!");
            router.push("/home");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Stock purchase failed");
        } finally {
            setLoading(false);
        }
    };

    const onSellCrypto = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/sellCrypto", { symbol, quantity });
            toast.success("Crypto sold!");
            router.push("/home");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Stock sale failed");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Satire Trade</h1>
                <input
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
                    type="text"
                    placeholder="Enter a cryptocurrency (full name)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                />
                <button
                    onClick={fetchCryptoPrice}
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
                    onClick={onBuyCrypto}
                    className="w-full p-2 bg-green-600 hover:bg-green-700 rounded-lg"
                    disabled={loading}
                >
                    Buy Crypto
                </button>
                <button
                    onClick={onSellCrypto}
                    className="w-full p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                    disabled={loading}
                >
                    Sell Crypto
                </button>
            </div>
    );
}
