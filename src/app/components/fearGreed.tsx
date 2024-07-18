import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./fearGreed.css";
 
const FearGreedIndex = () => {
  const [index, setIndex] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = process.env.NEXT_PUBLIC_ROUTE;

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const response = await axios.get(`${key}/api/fear`);
        setIndex(response.data);
        console.log(response.data);
      } catch (error) {
        setError('Failed to fetch Fear and Greed Index');
      } finally {
        setLoading(false);
      }
    };

    fetchIndex();
    //every hour
    const interval = setInterval(fetchIndex, 3600000); 

    return () => clearInterval(interval); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const angle = index ? (index[0] / 100) * 180 - 90 : 0; // Convert value to angle 

  return (
    <div className="fgi-container text-[#c0c0c0] font-bold">
      <h2>Fear and Greed Index</h2>
      <div className="fgi-value text-white">
        <div>{index[0].toFixed(2)}</div>
        <div>{index[1]}</div>
      </div>
      <div className="fgi-dial">
        <div className="fgi-arrow" style={{ transform: `rotate(${angle}deg)` }} />
      </div>
    </div>
  );
};

export default FearGreedIndex;