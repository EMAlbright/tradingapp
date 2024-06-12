import { useEffect, useState } from "react"
import axios from "axios";
import "./invested.css";

export default function Invested () {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [investment, setInvestment] = useState(0);

    useEffect(() => {
        const fetchInvestment = async () => {
            try {
                const response = await axios.get("/api/users/invested")
                setInvestment(response.data.invested);
            } catch(error){
                setError("error getting investment")
            } finally{
                setLoading(true);
            }
        }
        fetchInvestment();

        const interval = setInterval(fetchInvestment, 600000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="investment">
          <hr />
          {investment !== null ? (
            <p>Invested: ${investment}</p>
          ) : (
            <p>Loading investment...</p>
          )}
        </div>
      );
    
}