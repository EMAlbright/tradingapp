"use client"
import { useEffect } from "react";
import UserHoldingStats from "../components/userHoldingStats/page";
import SectorInformation from "../components/sectorInformation/page";
import SideBar from "../components/sidebar/page";

export default function Assets() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4 flex">
            <SideBar />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="mb-8">
                    <UserHoldingStats />
                </div>
                <div>
                    <SectorInformation />
                </div>
            </div>
        </div>
    )
}