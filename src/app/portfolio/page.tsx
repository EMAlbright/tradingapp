import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./portfolio.css";

interface PortfolioPosition {
    symbol: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    percentageChange: number;
    totalCost: number;
    currentValue: number;
}

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsername = async () => {
            try{
                const response = await axios.get('/api/users/me');
                setUsername(response.data.data.username);
            } catch (error) {
                setError('Failed to fetch portfolio data');
            } finally {
                setLoading(false);
            }
        }
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get('/api/users/portfolio');
                setPortfolio(response.data);
            } catch (error) {
                setError('Failed to fetch portfolio data');
            } finally {
                setLoading(false);
            }
        };
        fetchUsername();
        fetchPortfolio();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container'>
            <h2 className='heading'>{username}'s Portfolio</h2>
            <table className='portfolioTable'>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Purchase Price</th>
                        <th>Current Price</th>
                        <th>Current Value</th>
                        <th>Percentage Change</th>
                    </tr>
                </thead>
            <tbody>
            {portfolio.map((position, index) => (
                <tr key={index} >
                    <td className='symbol'>{position.symbol}</td>
                    <td className='quantity'>{position.quantity}</td>
                    <td className='purchasePrice'>${position.purchasePrice}</td>
                    <td className='currentPrice'>${position.currentPrice}</td>
                    <td className='currentValue'>${position.currentValue}</td>
                    <td className='percentageChange'>{position.percentageChange.toFixed(2)}%</td>
                    </tr>
            ))}
            </tbody>
            </table>
        </div>
    );
};

export default Portfolio;
