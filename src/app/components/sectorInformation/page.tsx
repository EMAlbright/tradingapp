import axios from "axios";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react"

interface SectorData {
    category: string,
    fiveYearAverageReturn: number,
    threeYearAverageReturn: number,
    ytdReturn: number
}

interface SectorMain {
    [key: string]: SectorData
}

const SectorInformation = () => {
    const [sectorInfo, setSectorInfo] = useState<SectorMain | null>(null);
    const [error, setError] = useState("");
    useEffect(() => {

        const fetchSectorData = async() => {
            try{
                const res = await axios.get("http://localhost:8000/api/sector/generalInformation")
                const data = res.data;
                setSectorInfo(data);
            }
            catch(error){
                setError("Failed to fetch sector information")
            }
        }
        fetchSectorData();
    }, []);

        if (error) return <div>Error: {error}</div>;
    if (!sectorInfo) return <div>Loading...</div>;

    return (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sector Performance</h2>
            <p className="text-sm text-gray-600 italic mb-4">*Note* Sector Performance is derived from index fund values</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(sectorInfo).map(([symbol, data]) => (
                    <div key={symbol} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">{symbol}</h3>
                        <p className="text-sm text-black">
                            YTD Return: <span className="font-bold text-green-600">{(data.ytdReturn * 100).toFixed(2)}%</span>
                        </p>
                        <p className="text-sm text-black">
                            3 Year Return: <span className="font-bold text-green-600">{(data.threeYearAverageReturn * 100).toFixed(2)}%</span>
                        </p>
                        <p className="text-sm text-black">
                            5 Year Return: <span className="font-bold text-green-600">{(data.fiveYearAverageReturn * 100).toFixed(2)}%</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SectorInformation;