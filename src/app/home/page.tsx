"use client"
import './page.css';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Balance from '../userBalance/page';
import TradingViewWidget from '../tradingview/page';
import FearGreedIndex from '../components/fearGreed';
import TenYearYield from '../components/tenYearYield';
import Portfolio from '../portfolio/page';
import Invested from '../invested/page';
import Gold from '../components/gold';
import Silver from '../components/silver';
import NewsWheel from '../news/page';
import ETH from '../components/eth';
import BTC from '../components/btc';
import Leaderboard from '../leaderboards/page';

export default function Home() {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <main className="mainContainer">
  <div className="topbarContainer">
    <section className="title">
      <h1>Satire Trade</h1>
    </section>
    <div className="Options">
    <div className='Profile'>
        <Link href="/profile">Profile</Link>
      </div>
      <div className="Assets">
        <Link href="/assets" className="Assets">
          Assets
        </Link>
      </div>
      <div className="Trade">
        <Link href="/trade" className="Trade">
          Trade
        </Link>
      </div>
      <div className='strategies'>
        <Link href="/backtest">Strategies</Link>
      </div>
      <div className="Learn">
        <Link href="/whales" className="Learn">
          Whale Tracker
        </Link>
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
          <div className='newsContainer'>
          < NewsWheel />
        </div>
        </div>
        <div className='indicators'>
          <div className='fearGreed'><FearGreedIndex /></div>
          <div className='tenYear'><TenYearYield /></div>
          < Leaderboard />
        </div>
        <div className='comm'>
          <div className='silver'><Silver /></div>
          <div className='gold'><Gold /></div>
          <div className='btc'><BTC /></div>
          <div className='eth'><ETH /></div>
        </div>
      </div>
</main>
  );
}
