"use client"
import './page.css';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Balance from '../userBalance/page';
import axios from 'axios';
import toast from 'react-hot-toast';
import TradingViewWidget from '../tradingview/page';
import FearGreedIndex from '../components/fearGreed';
import TenYearYield from '../components/tenYearYield';
import Portfolio from '../portfolio/page';
import Invested from '../invested/page';

export default function Home() {

  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const heightThreshold = 2000;
    if (scrollPosition >= heightThreshold && !loading) {
      setLoading(true);
      
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="mainContainer">
  <div className="topbarContainer">
    <section className="title">
      <h1>Satire Trade</h1>
    </section>
    <div className="Options">
      <div className="Assets">
        <Link href="/assets" className="Assets">
          Assets
        </Link>
      </div>
      <div className="Portfolio">
        <Link href="/Portfolio" className="Portfolio">
          Portfolio
        </Link>
      </div>
      <div className="Trade">
        <Link href="/trade" className="Trade">
          Trade
        </Link>
      </div>
      <div className="Learn">
        <Link href="/Learn" className="Learn">
          Learn
        </Link>
      </div>
      <div className='Profile'>
        <Link href="/profile">Profile</Link>
      </div>
      <div className='strategies'>
        <Link href="/backtest">Strategies</Link>
      </div>
      <div className='balance'>
        <Balance />
        <Invested />
      </div>
    </div>
  </div>
  <div className='contentContainer'>
    <div className='mainContent'>
      <div className="tradingViewChart">
      <TradingViewWidget />
      </div>
      <div className='portfolio'>
     <Portfolio/>
      </div>
    </div>
  <div className='indicators'>
      <div className='fearGreed'><FearGreedIndex /></div>
      <div className='tenYear'><TenYearYield /></div>
    </div>
  </div>
</main>
  );
}
