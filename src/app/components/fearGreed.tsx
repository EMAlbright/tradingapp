import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./fearGreed.css";

interface FearGreedIndexData {
  fgi: {
    now: {
      value: number,
      valueText: string,
    }
  }
}


const FearGreedIndex = () => {
  const [index, setIndex] = useState<FearGreedIndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const response = await axios.get('/api/indicators/fearGreed');
        setIndex(response.data);
      } catch (error) {
        setError('Failed to fetch Fear and Greed Index');
      } finally {
        setLoading(false);
      }
    };

    fetchIndex();
    /* const interval = setInterval(fetchIndex, 60000); // Fetch every minute

    return () => clearInterval(interval); */
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const angle = index ? (index.fgi.now.value / 100) * 180 - 90 : 0; // Convert value to angle 

  return (
    <div className="fgi-container">
      <h2>Fear and Greed Index</h2>
      <div className="fgi-value">
        <div>{index?.fgi.now.value}</div>
        <div>{index?.fgi.now.valueText}</div>
      </div>
      <div className="fgi-dial">
        <div className="fgi-arrow" style={{ transform: `rotate(${angle}deg)` }} />
      </div>
    </div>
  );
};

export default FearGreedIndex;