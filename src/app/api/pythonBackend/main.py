import fear_and_greed
import yfinance as yf
from flask_cors import CORS
from flask import jsonify, Flask
from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG
import pandas_datareader as web
import datetime as dt
import numpy as np
import json
from bokeh.io.export import get_screenshot_as_png
from typing import List
import talib
from io import BytesIO
from flask import Flask, jsonify, request, send_file, render_template_string


app = Flask(__name__)
CORS(app)

# get sector
@app.route("/api/sector", methods=["POST"])
def getSector():
    data = request.json
    print(data)
   
    stockInformation ={}
    tickers = data.get('tickerHoldings', [])
    # currently only for stocks, need to add cryto with dif library
    # response is going to be differen
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            if not info:
                continue
            sector = info.get('sector', 'Unknown')
            summary = info.get('longBusinessSummary', 'Unknown')
            volume = info.get('volume', 'Unknown')
            avgVolume = info.get('averageVolume', 'Unknown')
            yearHigh = info.get('fiftyTwoWeekHigh', 'Unknown')
            yearLow = info.get('fiftyTwoWeekLow', 'Unknown')
            twoHundredDayAverage = info.get('twoHundredDayAverage', 'Unknown')
            fiftyDayAverage = info.get('fiftyDayAverage', 'Unknown')
            marketCap = info.get('marketCap', 'Unknown')
            targetHigh = info.get('targetHighPrice', 'Unknown')
            targetLow = info.get('targetLowPrice', 'Unknown')
            analystOpinion = info.get('recommendationKey', 'Unknown')
            analystCount = info.get('numberOfAnalystOpinions', 'Unknown')

            stockInformation[ticker] = {
                               'sector': sector,
                               'summary': summary,
                               'volume': volume,
                               'avgVolume': avgVolume,
                               'yearHigh': yearHigh,
                               'yearLow': yearLow,
                               'twoHundredDayAverage': twoHundredDayAverage,
                               'fiftyDayAverage': fiftyDayAverage,
                               'marketCap': marketCap,
                               'targetHigh': targetHigh,
                               'targetLow': targetLow,
                               'analystOpinion': analystOpinion,
                               'analystCount': analystCount}
        except Exception as e:
            print(f"Error fetching data for {ticker}: {e}") 
    return jsonify(stockInformation), 200

# information for each major sector
@app.route("/api/sector/generalInformation")
def sectorInformation():
    sector_etfs = {
        "Technology": "XLK",
        "Healthcare": "XLV",
        "Financials": "XLF",
        "Consumer Discretionary": "XLY",
        "Industrials": "XLI",
        "Energy": "XLE",
        "Utilities": "XLU",
        "Materials": "XLB",
        "Real Estate": "XLRE",
        "Consumer Staples": "XLP",
        "Communication Services": "XLC"}

    sectorInformation = {}

    for sector, ticker in sector_etfs.items():
        stock = yf.Ticker(ticker)
        info = stock.info
        sectorInformation[sector] = info
    return jsonify(sectorInformation)

# fear greed index 
@app.route("/api/fear")
def fgi():
    data =fear_and_greed.get()
    return jsonify(data)

# ten year yield rate
@app.route("/api/tenYear")
def tenYear():
    try:
        treasury = yf.Ticker("^TNX")
        data = treasury.history(period="1d")
        if data.empty:
            return jsonify({"error": "No data available"}), 404

        # Get the last row 
        last_row = data.iloc[-1]
        
        response = {
            "yield": float(last_row['Close']),
            "date": last_row.name.strftime('%Y-%m-%d'),
            "open": float(last_row['Open']),
            "high": float(last_row['High']),
            "low": float(last_row['Low']),
            "volume": int(last_row['Volume'])
        }
        return jsonify(response)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500  

# backtest strategies
class RSI_Strategy(Strategy):
    def init(self):
        price = self.data.Close
        # Calculate RSI
        self.rsi = self.I(talib.RSI, price, timeperiod=14)
    
    def next(self):
        if self.rsi[-1] < 30:  # RSI below 30 indicates oversold
            self.buy()
        elif self.rsi[-1] > 70:  # RSI above 70 indicates overbought
            self.sell()

class StochasticOscillatorStrategy(Strategy):
    def init(self):
        self.stoch_k, self.stoch_d = self.I(talib.STOCH, self.data.High, self.data.Low, self.data.Close)

    def next(self):
        if crossover(self.stoch_k, self.stoch_d) and self.stoch_k[-1] < 20:
            self.buy()
        elif crossover(self.stoch_d, self.stoch_k) and self.stoch_k[-1] > 80:
            self.sell()

class BBStrategy(Strategy):
    def init(self):
        price = self.data.Close
        self.upper, self.middle, self.lower = self.I(talib.BBANDS, price, timeperiod=20)
    
    def next(self):
        if self.data.Close < self.lower[-1]:
            self.buy()
            # higher than sell
        elif self.data.Close >= self.lower[-1]:
            self.sell()

class MovingAverageStrategy(Strategy):
    def init(self):
        price = self.data.Close
        # 10 day MA
        self.ma1 = self.I(SMA, price, 10)
        # 20 day MA
        self.ma2 = self.I(SMA, price, 20)
    
    def next(self):
        if crossover(self.ma1, self.ma2):
            self.buy()
        elif crossover(self.ma2, self.ma1):
            self.sell()
#fib still broken
class fibonacciStrategy(Strategy):
    def init(self):
        price = self.data.Close
        self.high = price.max()
        self.low = price.min()
        self.fibLevels = [
            self.high,
            self.high - .236 * (self.high - self.low),
            self.high - .382 * (self.high - self.low),
            self.high - .618 * (self.high - self.low),
            self.low
        ]
    
    def next(self):
        price = self.data.Close[-1]
        if price < self.fibLevels[3]:
            self.buy()
        elif price > self.fibLevels[1]:
            self.sell()

#rsi and macd
class BBRMACDStrategy(Strategy):
    def init(self):
        price = self.data.Close
        # Calculate MACD
        macd, signal, _ = self.I(talib.MACD, price, fastperiod=12, slowperiod=26, signalperiod=9)
        self.macd_line = macd - signal
        # Calculate RSI
        self.rsi = self.I(talib.RSI, price, timeperiod=14)
    
    def next(self):
        if (crossover(self.macd_line, 0)) and (self.rsi[-1] < 30):
            self.buy()
        elif (crossover(0, self.macd_line) and (self.rsi[-1] > 70)):
            self.sell()

class MACDStrategy(Strategy):
    def init(self):
        price = self.data.Close
        # Calculate MACD
        macd, signal, _ = self.I(talib.MACD, price, fastperiod=12, slowperiod=26, signalperiod=9)
        self.macd_line = macd - signal

    def next(self):
        if crossover(self.macd_line, 0):
            self.buy()
        elif crossover(0, self.macd_line):
            self.sell()

class ElderRayIndexStrategy(Strategy):
    def init(self):
        high = self.data.High
        low = self.data.Low
        close = self.data.Close
        self.bull_power = self.I(talib.EMA, high - talib.EMA(close, timeperiod=13), timeperiod=13)
        self.bear_power = self.I(talib.EMA, low - talib.EMA(close, timeperiod=13), timeperiod=13)
    
    def next(self):
        if self.bull_power[-1] > 0 and self.bear_power[-1] < 0:
            self.buy()
        elif self.bull_power[-1] < 0 and self.bear_power[-1] > 0:
            self.sell()

class WilliamsRStrategy(Strategy):
    def init(self):
        high = self.data.High
        low = self.data.Low
        close = self.data.Close
        self.williams_r = self.I(talib.WILLR, high, low, close, timeperiod=14)
    
    def next(self):
        if self.williams_r[-1] < -80:  # Oversold
            self.buy()
        elif self.williams_r[-1] > -20:  # Overbought
            self.sell()

class ChandeMomentumOscillatorStrategy(Strategy):
    def init(self):
        close = self.data.Close
        self.cmo = self.I(talib.CMO, close, timeperiod=14)
    
    def next(self):
        if self.cmo[-1] > 50:  # Overbought
            self.sell()
        elif self.cmo[-1] < -50:  # Oversold
            self.buy()

class CMFStrategy(Strategy):
    def init(self):
        high = np.array(self.data.High, dtype=np.float64)
        low = np.array(self.data.Low, dtype=np.float64)
        close = np.array(self.data.Close, dtype=np.float64)
        volume = np.array(self.data.Volume, dtype=np.float64)
        self.cmf = self.I(talib.ADOSC, high, low, close, volume, fastperiod=3, slowperiod=10)
    
    def next(self):
        if self.cmf[-1] > 0:
            self.buy()
        elif self.cmf[-1] < 0:
            self.sell()

data= web.DataReader("MSFT", "stooq","02-14-2024", "06-13-2024")
backtestData = Backtest(data, ElderRayIndexStrategy, commission=.002, exclusive_orders=True)
print(backtestData.run())

class CCIStrategy(Strategy):
    def init(self):
        self.cci = self.I(talib.CCI, self.data.High, self.data.Low, self.data.Close, timeperiod=20)

    def next(self):
        if self.cci[-1] > 100:
            self.buy()
        elif self.cci[-1] < -100:
            self.sell()

class sarStrategy(Strategy):
    def init(self):
        self.sar = self.I(talib.SAR, self.data.High, self.data.Low, acceleration=.02, maximum=.2)
    
    def next(self):
        if crossover(self.data.Close, self.sar):
            self.buy()
        elif crossover(self.sar, self.data.Close):
            self.sell()

# start with 9 more strategies
strategies = {
    "moving_sma": MovingAverageStrategy,
    "rsi": RSI_Strategy,
    "bollinger_band": BBStrategy,
    "macd": MACDStrategy,
    "cci": CCIStrategy,
    "sar": sarStrategy,
    "sto": StochasticOscillatorStrategy,
    "fib": fibonacciStrategy,
    "wil": WilliamsRStrategy,
    "cmo": ChandeMomentumOscillatorStrategy,
    "elder": ElderRayIndexStrategy,
    "cmf": CMFStrategy
}

#data= web.DataReader("MSFT", "stooq","02-14-2024", "06-13-2024")
#backtestData = Backtest(data, ElderRayIndexStrategy, commission=.002, exclusive_orders=True)
#backtestData.run()
#plot = backtestData.plot()

@app.route("/api/strategies")
def return_strategies():

    strategyName = request.args.get("strategy")
    start = request.args.get("start")
    end = request.args.get("end")
    stock = request.args.get("stock")

    if not all([strategyName, start, end, stock]):
        return jsonify({"Error, Missing Parameter"})
    
    strategy_class = strategies.get(strategyName)
    if not strategy_class:
        return jsonify({"Not a valid strategy"})
    
    start_date = dt.datetime.strptime(start, '%Y-%m-%d')
    end_date = dt.datetime.strptime(end, '%Y-%m-%d')
    data =yf.download(stock, start=start_date, end=end_date)
    #data= web.DataReader(stock, "stooq", start_date, end_date)
    backtestData = Backtest(data, strategy_class, commission=.002, exclusive_orders=True)
    statsData = backtestData.run()
    stats_json = statsData.to_json()
    stats_dict = json.loads(stats_json)

    result = {
        "BestTrade": stats_dict["Best Trade [%]"],
        "TotalReturn": stats_dict["Return [%]"],
        "HoldReturn": stats_dict["Buy & Hold Return [%]"],
        "NumTrades": stats_dict["# Trades"],
        "WinRate": stats_dict["Win Rate [%]"],
        "WorstTrade": stats_dict["Worst Trade [%]"],
        "AvgTrade": stats_dict["Avg. Trade [%]"],
    }
    return jsonify(result)

@app.route("/api/plot")
def return_plot():
    strategyName = request.args.get("strategy")
    start = request.args.get("start")
    end = request.args.get("end")
    stock = request.args.get("stock")

    if not all([strategyName, start, end, stock]):
        return jsonify({"Error, Missing Parameter"})
    
    strategy_class = strategies.get(strategyName)
    if not strategy_class:
        return jsonify({"Not a valid strategy"})
    
    start_date = dt.datetime.strptime(start, '%Y-%m-%d')
    end_date = dt.datetime.strptime(end, '%Y-%m-%d')

    data= web.DataReader(stock, "stooq", start_date, end_date)
    backtestData = Backtest(data, strategy_class, commission=.002, exclusive_orders=True)
    backtestData.run()
    

    fig = backtestData.plot(open_browser=False)
    img = BytesIO()
    get_screenshot_as_png(fig).save(img, format='PNG')
    img.seek(0)

    return send_file(img, mimetype='image/png')
    # Convert the plot to a PNG image in memory


if __name__ == "__main__":
    app.run(debug=True, port=8000)