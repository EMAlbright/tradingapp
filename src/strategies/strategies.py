from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG
import pandas_datareader as web
import datetime as dt
import matplotlib.pyplot as plt
from typing import List
import flask
import talib

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

class BBStrategy(Strategy):
    def init(self):
        price = self.data.Close
        self.upper, self.middle, self.lower = self.I(talib.BBANDS, price, timeperiod=20)
    
    def next(self):
        if self.data.Close[-1] < self.lower[-1]:  # Price below lower band
            self.buy()
            # higher than sell
        elif self.data.Close[-1] >= self.lower[-1]:
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
    "sar": sarStrategy
}

start = dt.datetime(2020,1,1)
end = dt.datetime(2024,5,13)
data =web.DataReader("TSLA", "stooq", start, end)
backtestSMA = Backtest(data, MovingAverageStrategy, commission=.002, exclusive_orders=True)
backtestRSI = Backtest(data, RSI_Strategy, commission=.002, exclusive_orders=True)
backtestBB = Backtest(data, BBStrategy, commission=.002, exclusive_orders=True)
backtestMACD = Backtest(data, MACDStrategy, commission=.002, exclusive_orders=True)
backtestCCI = Backtest(data, CCIStrategy, commission=.002, exclusive_orders=True)
backtestSAR = Backtest(data, sarStrategy, commission=.002, exclusive_orders=True)
statsSMA = backtestSMA.run()
statsRSI = backtestRSI.run()
statsBB = backtestBB.run()
statsMACD = backtestMACD.run()
statsCCI = backtestCCI.run()
statsSAR = backtestSAR.run()
print("SMA\n:", statsSMA)
print("\nRSI:", statsRSI)
print("\nBollingerBand:", statsBB)
print("\nMACD:", statsMACD)
print("\nCCI:", statsCCI)
print("\nSAR:", statsSAR)
#backtest.plot()


