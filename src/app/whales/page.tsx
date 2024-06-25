"use client"
import React, { useState } from 'react';
import axios from 'axios';

interface FilerInfo {
    member_name: string,
    party: string,
    state: string,
    headshot: string,    
}

interface Security {
    name: string,
    ticker: string,
    type: string    
}

interface PoliticianData {
    amount: string,
    chamber: string,
    filer_info: FilerInfo,
    security: Security,
    transaction_date: string;
}

const PoliticianData = () => {
  const [politicianData, setPoliticianData] = useState<PoliticianData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  const fetchData = async (politicianName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/thirdParties/politicians?name=${politicianName}`);
      setPoliticianData(response.data);
    } catch (error) {
      setError('Failed to fetch Data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(name);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter politician name" 
        />
        <button type="submit">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && politicianData.length > 0 && (
        <table className="data-container">
          <thead>
            <tr>
                <th>Headshot</th>
                <th>Name</th>
                <th>Party</th>
                <th>Chamber</th>
                <th>State</th>
                <th>Asset</th>
                <th>Ticker</th>
                <th>Transaction Type</th>
                <th>Amount</th>
                <th>Transaction Date</th>
            </tr>
          </thead>     
          <tbody>
          {politicianData.map((data, index) => (
            <tr key={index} className='politicians'>
              <td><img src={data.filer_info.headshot} width="100px" height="100px" alt="Headshot" /></td>
              <td>{data.filer_info.member_name}</td>
              <td>{data.filer_info.party}</td>
              <td>{data.chamber}</td>
              <td>{data.filer_info.state}</td>
              <td>{data.security.name}</td>
              <td>{data.security.ticker}</td>
              <td>{data.security.type}</td>
              <td>{data.amount}</td>
              <td>{data.transaction_date}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PoliticianData;
