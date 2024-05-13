"use client"
import './page.css';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import StockList from '../tradingview/page';

export default function Home() {
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
        <Link href="/Trade" className="Trade">
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
    </div>
  </div>
  <div className="tradingViewChart" style={{ height: "500px" }}>
     <StockList />
  </div>
</main>
  );
}
