import axios from "axios";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PortfolioData {
    sectorData: {
        [symbol: string]: {
            sector: string,
            summary: string,
            volume: number,
            avgVolume: number,
            yearHigh: number,
            yearLow: number,
            twoHundredDayAverage: number,
            fiftyDayAverage: number,
            marketCap: number,
            targetHigh: number,
            targetLow: number,
            analystOpinion: string,
            analystCount: number
        };
    };
}

const UserHoldingStats = () => {
    const [userHoldingStats, setUserHoldingStats] = useState<PortfolioData | null>(null);
    const [chartData, setChartData] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const res = await axios.get("../../api/users/userStats");
                setUserHoldingStats(res.data);
                console.log(res.data);
                processChartData(res.data.sectorData);
            } catch(error) {
                console.error("Error fetching user stats: ", error);
            }
        }
        fetchData();
    }, []);

    const processChartData = (sectorData: PortfolioData['sectorData']) => {
        const sectorCounts: {[key: string]: number} = {};
        Object.values(sectorData).forEach(({ sector }) => {
            sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
        });

        const labels = Object.keys(sectorCounts);
        const data = Object.values(sectorCounts);
        const total = data.reduce((sum, value) => sum + value, 0);
        const percentages = data.map(value => ((value / total) * 100).toFixed(2));

        const backgroundColors = labels.map(() => 
            `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
        );

        setChartData({
            labels,
            datasets: [{
                data: percentages,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1,
            }],
        });
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };


return(
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Breakdown</h1>
            <div className="flex flex-col md:flex-row items-center justify-between">
                {chartData && (
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                        <Pie data={chartData} options={options} />
                    </div>
                )}
                <div className="w-full md:w-1/2">
                    {userHoldingStats?.sectorData && (
                        <div className="mt-4 max-h-95 overflow-y-auto">
                            {Object.entries(userHoldingStats?.sectorData).map(([symbol, data]) => (
                                <div key={symbol} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{symbol}</h3>
                                    <p className="text-sm text-black"><span className="font-bold">Sector:</span> {data.sector}</p>
                                    <p className="text-sm text-black"><span className="font-bold">Analyst Opinion:</span> {data.analystOpinion}</p>
                                    <p className="text-sm text-black"><span className="font-bold">Number of Analysts:</span> {data.analystCount}</p>
                                    <p className="text-sm text-black"><span className="font-bold">Target High:</span> ${data.targetHigh}</p>
                                    <p className="text-sm text-black"><span className="font-bold">Target Low:</span> ${data.targetLow}</p>
                                    <p className="text-sm text-black"><span className="font-bold">Yearly High:</span> ${data.yearHigh}</p>
                                    <p className="text-sm text-black"><span className="font-bold">Yearly Low:</span> ${data.yearLow}</p>
                                    <p className="text-sm text-black"><span className="font-bold">Market Cap:</span> ${data.marketCap.toLocaleString()}</p>
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-blue-500 hover:text-blue-700">More Details</summary>
                                        <p className="text-sm mt-2 text-black"><span className="font-bold">Business Summary:</span> {data.summary}</p>
                                        <p className="text-sm text-black"><span className="font-bold">Volume Today:</span> {data.volume.toLocaleString()}</p>
                                        <p className="text-sm text-black"><span className="font-bold">Average Volume:</span> {data.avgVolume.toLocaleString()}</p>
                                        <p className="text-sm text-black"><span className="font-bold">50 Day Price Average:</span> ${data.fiftyDayAverage.toFixed(2)}</p>
                                        <p className="text-sm text-black"><span className="font-bold">200 Day Price Average:</span> ${data.twoHundredDayAverage.toFixed(2)}</p>
                                    </details>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserHoldingStats;