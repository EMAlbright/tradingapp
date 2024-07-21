"use client";
import BuyStockPage from "../buyStock/page";
import BuyCryptoPage from "../buyCrypto/page";
import SideBar from "../components/sidebar/page";
import "./trade.css";

export default function TradingPage() {
    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4 flex">
            <SideBar />
            <div className="flex-1 flex justify-center items-center">
                <div className="trading-container">
                    <div className="trading-box">
                        <BuyStockPage/>
                    </div>
                    <div className="trading-box">
                        <BuyCryptoPage/>
                    </div>
                </div>
            </div>
        </div>
    )
}