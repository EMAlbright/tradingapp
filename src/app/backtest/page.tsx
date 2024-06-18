"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Router, { useRouter } from "next/navigation";
import "./backtest.css";
interface BacktestResult {
  AvgTrade: number;
  BestTrade: number;
  NumTrades: number;
  PF: number;
  TotalReturn: number;
  HoldReturn: number;
  WinRate: number;
  WorstTrade: number;
}

export default function Backtest() {
  const [data, setData] = useState<BacktestResult | null>(null);
  const [strategy, setStrategy] = useState('');
  const [stock, setStock] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchData = () => {
    setLoading(true);
    axios.get('http://localhost:8080/api/strategies', {
      params: { strategy, stock, start, end }
    })
    .then(response => {
      setData(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchData();
  };

  const isValidData = (data: BacktestResult | null): data is BacktestResult => {
    return data !== null &&
      typeof data.AvgTrade === 'number' &&
      typeof data.BestTrade === 'number' &&
      typeof data.NumTrades === 'number' &&
      typeof data.PF === 'number' &&
      typeof data.TotalReturn === 'number' &&
      typeof data.HoldReturn === 'number' &&
      typeof data.WinRate === 'number' &&
      typeof data.WorstTrade === 'number';
  };

  const onHome = async() =>{
    router.push("/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4">
      <button className="homeButton" onClick={onHome}>
        <i className="animation">
      </i>Home<i className="animation"></i></button>
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Backtest</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
          >
            <option value="moving_sma">Moving SMA</option>
            <option value="rsi">RSI</option>
            <option value="bollinger_band">Bollinger Band</option>
            <option value="macd">MACD</option>
            <option value="cci">CCI</option>
            <option value="sar">SAR</option>
            <option value="sto">Stochastic Oscillator</option>
            <option value="fib">Fibonacci Retracement</option>
            <option value = "wil">Williams %R Strategy</option>
            <option value = "cmo">Chande Momentum Oscillator</option>
            <option value = "elder">Elder Ray Index</option>
          </select>
          <input
            type="text"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
            placeholder="Enter stock ticker"
          />
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
          />
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 placeholder-gray-400 text-white"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Run Backtest'}
          </button>
        </form>
        {!data && !loading && <div className="text-center">Indicator was not set off.</div>}
        {isValidData(data) && (
          <div className="mt-4 p-4 white rounded-lg shadow-md">
            <div className="text-center text-lg font-bold">Backtest Statistics:</div>
            <div className="space-y-2">
              <div>Total Return: {data.TotalReturn.toFixed(2)}%</div>
              <div>Total Return if Held: {data.HoldReturn.toFixed(2)}%</div>
              <div>Average Trade Return: {data.AvgTrade.toFixed(2)}%</div>
              <div>Number of Trades: {data.NumTrades}</div>
              <div>Win Rate: {data.WinRate.toFixed(2)}%</div>
              <div>Best Trade: {data.BestTrade.toFixed(2)}%</div>
              <div>Worst Trade: {data.WorstTrade.toFixed(2)}%</div>
              <div>Profit Factor: {data.PF.toFixed(2)}</div>
            </div>
          </div>
        )}
    </div>
    </div>
  );
}
