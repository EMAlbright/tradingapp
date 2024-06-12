import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./tenYearYield.css";

interface TenYearData {
      value: number,
      date: string,
  }


const TenYearYield = () => {
  const [tenYear, setTenYear] = useState<TenYearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTen = async () => {
      try {
        const response = await axios.get('/api/indicators/tenYearYield');
        setTenYear(response.data);
        console.log(tenYear?.value);
      } catch (error) {
        setError('Failed to fetch Fear and Greed Index');
      } finally {
        setLoading(false);
      }
    };
    //get every hour
    fetchTen();
    const interval = setInterval(fetchTen, 3600000); 

    return () => clearInterval(interval); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="yield-container">
      <h2 className='header'>Ten Year Yield</h2>
      <div className="fgi-value">
        <div>{tenYear?.value}</div>
        </div>
    </div>
  );
};

export default TenYearYield;