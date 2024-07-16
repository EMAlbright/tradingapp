"use client"
import { useEffect } from "react";
import UserHoldingStats from "../components/userHoldingStats/page";
import SectorInformation from "../components/sectorInformation/page";
import { useRouter } from "next/navigation";
import "./page.css";

export default function Assets() {  
    const router = useRouter()
    const onHome = async() => {
        router.push("/home");
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4">
            <button className="homeButton" onClick={onHome}>
                <i className="animation">
                </i>Home<i className="animation"></i></button>
            <div className="mt-20">
            <UserHoldingStats />
            <SectorInformation />
            </div>
        </div>
    )
}
