import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./tenYearYield.css";



const TenYearYield = () => {
  const [tenYear, setTenYear] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const FetchYield = async () => {
      try{
        const res = await axios.get('http://localhost:8080/api/tenYear');
        setTenYear(res.data.yield);
      }
      catch(error){
        setError('Failed to fetch Ten Year');
      }
      finally {
        setLoading(false);
      }
    }
    //get every hour
    FetchYield();
    const interval = setInterval(FetchYield, 43200000); 

    return () => clearInterval(interval); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="text-[#c0c0c0] font-bold">
      <h2 className='header'>Ten Year Yield</h2>
      <div className="text-center font-semibold text-white">
        <div>{tenYear.toFixed(2)}%</div>
        </div>
    </div>
  );
};

export default TenYearYield;