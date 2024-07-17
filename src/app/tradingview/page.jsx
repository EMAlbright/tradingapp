// TradingViewWidget.jsx
"use client"
import React, { useEffect, useRef, memo} from 'react';

function TradingViewWidget() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "calendar": true,
          "support_host": "https://www.tradingview.com"
        }`;
        if (container.current) {
          container.current.appendChild(script);
        }
      return () => {
        if(container.current){
          container.current.removeChild(script);
        }
      };
    },
    []
  );

  return (
    <div className="tradingview-widget-container" style={{height: "500px", width:"750px"}} ref={container} >
      <div className="tradingview-widget-container__widget" ></div>
    </div>
  );
}

export default React.memo(TradingViewWidget);
