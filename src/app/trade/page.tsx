"use client";
import BuyStockPage from "../buyStock/page"
import Router, { useRouter } from "next/navigation";
import "./trade.css";

export default function TradingPage() {
    const router = useRouter();

    const onHome = async() =>{
        router.push("/home");
    }

    return(
        <div className="trading-page">
            <button className="homeButton" onClick={onHome}>
                <i className="animation">
                    </i>Home<i className="animation"></i>
            </button>
            < BuyStockPage/>
        </div>
    )
}