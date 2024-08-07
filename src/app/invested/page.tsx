"use client"
import { useEffect, useState } from "react"
import axios from "axios";
import "./invested.css";

export default function Invested () {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [investment, setInvestment] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [PL, setPL] = useState(0);

    useEffect(() => {
        const fetchInvestment = async () => {
            try {
                const response = await axios.get("/api/users/invested");
                setInvestment(response.data.invested);
                setPercentage(response.data.overallPercentageChange);
                setPL(response.data.PL);
                console.log("invested: ", response.data.invested);
            } catch(error){
                setError("error getting investment")
            } finally{
                setLoading(false);
            }
        } 
        fetchInvestment();

        const interval = setInterval(fetchInvestment, 1200000);
        return () => clearInterval(interval);
    }, []);
    console.log(`Stocks: ${investment}`)
    console.log(`Stocks PL: ${PL}`)
    return (
        <div className="investment">
          <hr />
          {investment !== null ? (
            <p>Invested: ${investment.toFixed(2)} {percentage > 0 ? (
              <span className="positive-arrow">▲</span>
          ) : (
              <span className="negative-arrow">▼</span>
          )}
            <span style={{ color: percentage > 0 ? '#4caf50' : '#f44336' }}>
            ${PL.toFixed(2)}
            </span></p>
          ) : (
            <p>Loading investment...</p>
          )}
            {percentage !== null && percentage !== undefined && (
                <p>
                    <span className="percent">{percentage.toFixed(2)}%</span>
                </p>
            )}
        </div>
      );
    
}