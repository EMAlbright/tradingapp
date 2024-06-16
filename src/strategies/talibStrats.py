import talib
print(talib.get_functions())

import pandas as pd

def moving_average_crossover_strategy(data):
    # Calculate moving averages
    data['SMA10'] = talib.SMA(data['Close'], timeperiod=10)
    data['SMA20'] = talib.SMA(data['Close'], timeperiod=20)

    # Generate signals based on crossover
    data['Signal'] = 0
    data.loc[data['SMA10'] > data['SMA20'], 'Signal'] = 1  # Buy signal
    data.loc[data['SMA10'] < data['SMA20'], 'Signal'] = -1  # Sell signal

    return data


