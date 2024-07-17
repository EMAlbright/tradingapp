import React from 'react';
import Image from 'next/image';
export const MovingSMA: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/EFuAw39GHZVgFoYCq8DDEpRsFXo=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_INV-final-Simple-Moving-Average-SMA-May-2021-01-98751e52a2d844a795d8d11434852d7c.jpg"alt='image'/>
      <h2>Simple Moving Average (SMA):</h2>
      <p>SMA calculates the average price of a security over a specified period, providing a smooth trend line that helps identify price direction.</p>
    </div>
  );
};

export const RSI: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/5jiLQrSzF2eHk0xxvWuNN_22W0o=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_final_Relative_Strength_Index_RSI_Jul_2020-01-98fcd0c032cb4f0da005c31c44440c90.jpg"alt='image'/>
      <h2>Relative Strength Index (RSI):</h2>
      <p>RSI measures the speed and change of price movements, indicating whether a security is overbought or oversold, which can signal potential trend reversals.</p>
    </div>
  );
};

export const BB: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/nTfemzLtwmgAFJ5k-qXRxUFn95Y=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_INV-final-Bollinger-Band-Definition-June-2021-01-518977e3031d405497003f1747a3c250.jpg"alt='image'/>
      <h2>Bollinger Band:</h2>
      <p>Bollinger Bands use a moving average and standard deviation to create bands around a security's price, showing volatility and potential breakout points.</p>
    </div>
  );
}

export const MACD: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/7cxoCzC1VLFakQV6-I5vzvBjrV8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_Final_Moving_Average_Convergence_Divergence_MACD_Aug_2020-02-58bf5e34f0f94730b6e2d56ef9032b6d.jpg"alt='image'/>
      <h2>MACD (Moving Average Convergence Divergence):</h2>
      <p>MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price, helping traders identify potential buy or sell signals.</p>
    </div>
  );
};

export const CCI: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/_OHdcP5Y09BRg7yFOH3HbmDDmC4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AAPL_CCI_Daily-9c9b7f0538d7459ca9855348c62d04a8.png"alt='image'/>
      <h2>CCI (Commodity Channel Index):</h2>
      <p>CCI measures the variation of a security's price from its statistical average, indicating potential overbought or oversold conditions and possible trend changes.</p>
    </div>
  );
};

export const SAR: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/3LqBchaIlEYNeF4pQyheQwcGmyY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_Final_Introduction_to_the_Parabolic_SAR_Nov_2020-01-c85bdb2490ad46949ddf4523b017ecdf.jpg"alt='image' />
      <h2>SAR (Parabolic Stop and Reverse):</h2>
      <p>SAR is a trend-following indicator that provides potential entry and exit points based on price momentum, flipping its direction when the trend reverses.</p>
    </div>
  );
};

export const STO: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/ypm7uHj3iXKDAts7uxfwr1Sj27U=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_INV-final-Stochastic-Oscillator-Jun-2021-01-0580390daa1c44ffaac8c7ffcbb96f6a.jpg"alt='image'/>
      <h2>Stochastic Oscillator:</h2>
      <p>The Stochastic Oscillator compares a security's closing price to its price range over a specified period, highlighting overbought or oversold conditions and potential trend shifts.</p>
    </div>
  );
};

export const FIB: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/LoFvhR15oPoEXdtlKNzzQExZ07o=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_INV-Fibonacci-Retracement-Levels-June-2021-01-a036f12c487e47e08e14ab42e1f1823b.jpg"alt='image'/>
      <h2>Fibonacci Retracement:</h2>
      <p>Fibonacci Retracement uses Fibonacci ratios to identify potential support and resistance levels in a security's price movement, aiding in determining entry and exit points.</p>
    </div>
  );
};

export const WIL: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/Xrp1rG4VXXvAmWp8MtNSk3V08zE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_INV-final-Williams-R-Definition-and-Uses-June-2021-01-b5f61d727df74545967310850ad46802.jpg"alt='image'/>
      <h2>Williams %R Strategy:</h2>
      <p>Williams %R Strategy measures overbought or oversold conditions based on a security's closing price in relation to its price range over a specified period, helping traders identify potential reversal points.</p>
    </div>
  );
};

export const CMO: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/5qc_9tU_pX6Zc8SlQWzoAPkylDQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/divergence-5bfd6f7246e0fb002645894b"alt='image'/>
      <h2>Chande Momentum Oscillator (CMO):</h2>
      <p>CMO measures the momentum of a security's price movement, highlighting potential trend changes and divergence between price and momentum, aiding in decision-making for traders.</p>
    </div>
  );
};

export const ELDER: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/Xz4UaJYfKC1QeS9x4SQnt0T02kc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_INV-final-Elder-Ray-Index-Definition-and-Uses-Apr-2021-01-78f807502ea446178254183c5dbbde9a.jpg"alt='image'/>
      <h2>Elder Ray Index:</h2>
      <p>The Elder Ray Index combines a bull power and bear power indicator to assess the strength of buying and selling pressure in a security, aiding in identifying potential trend changes.</p>
    </div>
  );
};

export const CMF: React.FC = () => {
  return (
    <div className="w-full p-8 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <Image src="https://www.investopedia.com/thmb/dO4aUJlzyzZV1BL7ax6xSnZoOT4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_final_The_Difference_Between_Chaikin_Money_Flow_and_Money_Flow_Index_Dec_2020-01-00a6f422e5d946a280a9b4bb43158b0b.jpg" alt='image'/>
      <h2>Chaikin Money Flow Strategy (CMF):</h2>
      <p>CMF measures the flow of money into or out of a security based on price and volume, providing insights into buying and selling pressure and potential price movements.</p>
    </div>
  );
};

