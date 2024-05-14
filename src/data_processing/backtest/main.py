from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG
import pandas_datareader as web
import datetime as dt
import matplotlib.pyplot as plt

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


start = dt.datetime(2024,1,1)
end = dt.datetime(2024,5,13)
data =web.DataReader("TSLA", "stooq", start, end)

backtest = Backtest(data, MovingAverageStrategy, commission=.002, exclusive_orders=True)
stats = backtest.run()
print(stats)
backtest.plot()

