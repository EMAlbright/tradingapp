from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG
import pandas_datareader as web
import datetime as dt
import matplotlib.pyplot as plt
from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel

app = FastAPI()

class BacktestRequest(BaseModel):
    symbol: str
    startDate: str
    endDate: str
    strategy: str

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

# start with 9 more strategies
strategies = {
    "moving_sma": MovingAverageStrategy,
    #RSI
    #Bollinger Band
}

#start = dt.datetime(2024,1,1)
#end = dt.datetime(2024,5,13)
#data =web.DataReader("TSLA", "stooq", start, end)
#backtest = Backtest(data, MovingAverageStrategy, commission=.002, exclusive_orders=True)
#stats = backtest.run()
#print(stats)
#backtest.plot()

@app.post("/strategies")
async def run_backtest(request: BacktestRequest):
    start = dt.datetime.strptime(request.startDate, '%Y-%m-%d')
    end = dt.datetime.strptime(request.endDate, '%Y-%m-%d' )
    data = web.DataReader(request.symbol, "stooq", start, end)

    if request.strategy not in strategies:
        raise HTTPException(status_code=400, detail="Not an available backtesting strategy")

    strategy = strategies[request.strategy]
    backtest = Backtest(data, strategy, commission=.002, exclusive_orders=True)
    stats = backtest.run()
    return stats._trades.to_dict()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

