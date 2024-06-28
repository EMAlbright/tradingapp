"use client";
import BuyStockPage from "../buyStock/page";
import BuyCryptoPage from "../buyCrypto/page";
import Router, { useRouter } from "next/navigation";
import "./trade.css";

export default function TradingPage() {
    const router = useRouter();

    const onHome = async() =>{
        router.push("/home");
    }

    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4">
            <button className="homeButton" onClick={onHome}>
                <i className="animation">
                    </i>Home<i className="animation"></i>
            </button>
            <div className="flex flex-row justify-center space-x-4">
                <div className="stocks">
                    < BuyStockPage/>
                </div>
                <div className="crypto">
                    < BuyCryptoPage/>
                </div>
            </div>
        </div>
    )
}