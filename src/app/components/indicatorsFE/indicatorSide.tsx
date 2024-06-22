import { ST } from 'next/dist/shared/lib/utils';
import React from 'react';

export const MovingSMA: React.FC = () => {
  return (
    <div>
      <h2>Simple Moving Average (SMA):</h2>
      <p>SMA calculates the average price of a security over a specified period, providing a smooth trend line that helps identify price direction.</p>
    </div>
  );
};

export const RSI: React.FC = () => {
  return (
    <div>
      <h2>Relative Strength Index (RSI):</h2>
      <p>RSI measures the speed and change of price movements, indicating whether a security is overbought or oversold, which can signal potential trend reversals.</p>
    </div>
  );
};

export const BB: React.FC = () => {
  return (
    <div>
      <h2>Bollinger Band:</h2>
      <p>Bollinger Bands use a moving average and standard deviation to create bands around a security's price, showing volatility and potential breakout points.</p>
    </div>
  );
}

export const MACD: React.FC = () => {
  return (
    <div>
      <h2>MACD (Moving Average Convergence Divergence):</h2>
      <p>MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price, helping traders identify potential buy or sell signals.</p>
    </div>
  );
};

export const CCI: React.FC = () => {
  return (
    <div>
      <h2>CCI (Commodity Channel Index):</h2>
      <p>CCI measures the variation of a security's price from its statistical average, indicating potential overbought or oversold conditions and possible trend changes.</p>
    </div>
  );
};

const SAR: React.FC = () => {
  return (
    <div>
      <h2>SAR (Parabolic Stop and Reverse):</h2>
      <p>SAR is a trend-following indicator that provides potential entry and exit points based on price momentum, flipping its direction when the trend reverses.</p>
    </div>
  );
};

export const STO: React.FC = () => {
  return (
    <div>
      <h2>Stochastic Oscillator:</h2>
      <p>The Stochastic Oscillator compares a security's closing price to its price range over a specified period, highlighting overbought or oversold conditions and potential trend shifts.</p>
    </div>
  );
};

export const FIB: React.FC = () => {
  return (
    <div>
      <h2>Fibonacci Retracement:</h2>
      <p>Fibonacci Retracement uses Fibonacci ratios to identify potential support and resistance levels in a security's price movement, aiding in determining entry and exit points.</p>
    </div>
  );
};

export const WIL: React.FC = () => {
  return (
    <div>
      <h2>Williams %R Strategy:</h2>
      <p>Williams %R Strategy measures overbought or oversold conditions based on a security's closing price in relation to its price range over a specified period, helping traders identify potential reversal points.</p>
    </div>
  );
};

export const CMO: React.FC = () => {
  return (
    <div>
      <h2>Chande Momentum Oscillator (CMO):</h2>
      <p>CMO measures the momentum of a security's price movement, highlighting potential trend changes and divergence between price and momentum, aiding in decision-making for traders.</p>
    </div>
  );
};

export const ELDER: React.FC = () => {
  return (
    <div>
      <h2>Elder Ray Index:</h2>
      <p>The Elder Ray Index combines a bull power and bear power indicator to assess the strength of buying and selling pressure in a security, aiding in identifying potential trend changes.</p>
    </div>
  );
};

export const CMF: React.FC = () => {
  return (
    <div>
      <h2>Chaikin Money Flow Strategy (CMF):</h2>
      <p>CMF measures the flow of money into or out of a security based on price and volume, providing insights into buying and selling pressure and potential price movements.</p>
    </div>
  );
};


export default {MovingSMA, RSI, BB, MACD, CCI, SAR, STO, FIB, WIL, CMO, ELDER, CMF};
