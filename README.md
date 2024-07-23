# Stock Market Simulator for New Investors

## Project Overview

This project is an advanced Stock Market Simulator designed to provide a comprehensive learning platform for new investors. It offers various functionalities including backtesting trading strategies, trading cryptocurrencies and stocks, viewing portfolio performance, and more. The aim is to create an engaging and informative tool that helps users understand and navigate the stock market with confidence.

## Features

- **Backtesting Trading Strategies:** Test common trading strategies with historical data to see how they would have performed. 
- **Real-Time Trading:** Trade cryptocurrencies and stocks with real-time price updates.
- **Portfolio Management:** Track your investments, view current holdings, and monitor performance.
- **Leaderboards:** Compete with other users and see who has the highest net worth.
- **Market Indicators:** Access key market indicators such as the Fear and Greed Index and the 10-Year Yield.
- **Whale Tracker:** Stay updated with trading activities of significant market players.
- **Stop Loss and Take Profit Orders:** Automate your trading strategies with these advanced order types.

## Technology Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Python, Flask, RESTful APIs
- **Database:** MongoDB
- **Data Sources:** Coincap, Finnhub

## Project Structure

- **Root Directory:**
  - **tradingapp (Next.js / main):**
    - **src:**
      - **app:** Contains frontend code and API routes.
        - **api:** Contains different folders with either Python backend files or TypeScript backend files.
      - **models:** Contains MongoDB models.
  - **dbconfig:** Database configuration file.

## Current Status

**This project is still in development.** Some features might not be fully functional, and there could be frequent updates and changes as I continue to enhance and expand the simulator. 

## Future Plans

- **Further Development of Backtesting Strategies:** Currently using TA-Lib for implementation of technical indicators (such as the CMO, MACD, RSI, etc.), and the Backtesting library to get the results of these trades.
- I plan on adding more mechanisms into this page specifically to give users more control over how they trade certain stocks in order to find patterns, what works, and what does not work.
- **Enhanced Analytics:** Provide users with in-depth portfolio analysis, including sector performance, future trends, and areas where their portfolio is lacking. 
- **Additional Market Indicators:** Include more market indicators for better analysis.
- **Educational Resources:** Provide tutorials and resources to help users learn more about investing and trading.

