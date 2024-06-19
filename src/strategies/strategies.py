from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG
import pandas_datareader as web
import datetime as dt
import json
from bokeh.io import export_png
import plotly.graph_objs as go
from bokeh.plotting import figure, output_notebook, show
import matplotlib.pyplot as plt
from typing import List
import talib
from io import BytesIO

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
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
}

data= web.DataReader("MSFT", "stooq","04-10-2024", "06-13-2024")
backtestData = Backtest(data, BBStrategy, commission=.002, exclusive_orders=True)
backtestData.run()
print(backtestData._results)
#backtestData.plot()

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

    data= web.DataReader(stock, "stooq", start_date, end_date)
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
    
    fig =backtestData.plot(open_browser=False)
    #output_notebook()
    #show(fig, notebook_handle=False)
    #html = fig.to_html(fig, full_html=False, include_plotlyjs=False)
    img = BytesIO()
    export_png(fig, filename=img)
    img.seek(0)

    return send_file(img, mimetype='image/png')
    # Convert the plot to a PNG image in memory
    

if __name__ == "__main__":
    app.run(debug=True, port=8080)

