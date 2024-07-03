"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Router, { useRouter } from "next/navigation";
import "./backtest.css";
import {MovingSMA, RSI, BB, MACD, CCI, SAR, STO, FIB, WIL, CMO, ELDER, CMF} from "../components/indicatorsFE/indicatorSide";
interface BacktestResult {
  AvgTrade: number;
  BestTrade: number;
  NumTrades: number;
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
  const [plotUrl, setPlotUrl] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
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

  const fetchPlot = () => {
    axios.get('http://localhost:8080/api/plot', {
      params: {strategy, stock, start, end},
      responseType: 'blob'
    })
    .then(response => {
      const url = URL.createObjectURL(response.data);
      setPlotUrl(url);
    })
    .catch(error => {
      console.error('Error fetching plot:', error);
      setLoading(false);
    });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchData();
  };

  const isValidData = (data: BacktestResult | null): data is BacktestResult => {
    return data !== null &&
      typeof data.AvgTrade === 'number' &&
      typeof data.BestTrade === 'number' &&
      typeof data.NumTrades === 'number' &&
      typeof data.TotalReturn === 'number' &&
      typeof data.HoldReturn === 'number' &&
      typeof data.WinRate === 'number' &&
      typeof data.WorstTrade === 'number';
  };

  const handleHover = (event: React.MouseEvent<HTMLSelectElement>) => {
    setHover((event.target as HTMLSelectElement).value);
  };

  const onHome = async() =>{
    router.push("/home");
  }

  return (
    <div className="min-h-screen flex flex-col md:space-x-4 md:flex-row items-center justify-center bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4">
      <button className="homeButton" onClick={onHome}>
        <i className="animation">
      </i>Home<i className="animation"></i></button>
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Backtest</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            onMouseOver={handleHover}
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
            <option value= "cmf">Chaikin Money Flow Strategy</option>
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
              <button onClick={fetchPlot} className="mt-4 p-2 bg-green-600 hover:bg-green-700 rounded-lg">
              Show Plot
              </button>
            </div>
          </div>
        )}
    </div>
    <div className='backTestGraph'>
    {plotUrl && (
         <img src={plotUrl} alt="Bokeh Plot" className="w-full h-full" />
        )}
    </div>
    <div className="relative mt-4 md:mt-0">
    <div className="w-full md:w-95 rounded-lg p-4">
            {hover === "moving_sma" && <MovingSMA/>}
            {hover === "rsi" &&<RSI />}
            {hover === "bollinger_band" &&<BB />}
            {hover === "macd" &&<MACD />}
            {hover === "cci" &&<CCI />}
            {hover === "sar" &&<SAR />}
            {hover === "sto" &&<STO />}
            {hover === "fib" &&<FIB />}
            {hover === "wil" &&<WIL />}
            {hover === "cmo" &&<CMO />}
            {hover === "cmf" &&<CMF />}
            {hover === "elder" &&<ELDER />}
        </div>
      </div>
    </div>
  );
}
