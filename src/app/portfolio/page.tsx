import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    useEffect(() => {
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

        fetchPortfolio();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>User Portfolio</h2>
            {portfolio.map((position, index) => (
                <div key={index} >
                    <p>Symbol: {position.symbol}</p>
                    <p>Quantity: {position.quantity}</p>
                    <p>Purchase Price: ${position.purchasePrice}</p>
                    <p>Current Price: ${position.currentPrice}</p>
                    <p>Total Cost: ${position.totalCost}</p>
                    <p>Current Value: ${position.currentValue}</p>
                    <p>Percentage Change: {position.percentageChange.toFixed(2)}%</p>
                </div>
            ))}
        </div>
    );
};

export default Portfolio;
