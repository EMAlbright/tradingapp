// get the user holdings
// get the current price of stock if user owns
// get the price of the stock when user purchased it
// add or subtract diff
// actually need to make a different section for this where there is
// an "available to trade / purchasing power"

import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import axios from "axios";

export interface iTradePosition {
    symbol: string,
    quantity: number,
    price: number,
}

connect();

export async function GET(request: NextRequest){
    try{
        const userID = await getDataFromToken(request);
        const user = await User.findOne({_id:userID}); 
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const positions = user.tradePositions || [];
        const key = process.env.NEXT_PUBLIC_FINNHUB_API;
        const tickerHoldings = positions.map((position: iTradePosition) => position.symbol);
        // Fetch current prices for all symbols
        const tickerPrices = await Promise.all(
            tickerHoldings.map(async (symbol: string) => {
                try {
                    //cryptos
                    const response = await axios.get(`https://api.coincap.io/v2/assets/${symbol}`);
                    return { symbol, priceUsd: parseFloat(response.data.data.priceUsd) };
                } catch (cryptoError) {
                    console.error(`${symbol}: ${cryptoError}`);
                    try {
                        //stonks
                        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`);
                        return { symbol, priceUsd: response.data.c };
                    } catch (stockError) {
                        console.error(`${symbol}: ${stockError}`);
                        return { symbol, priceUsd: null }; 
                    }
                }
            })
        );

        let totalInitialInvestment = 0;
        let totalCurrentValue = 0;
        
        let total = 0;
        const portfolio = positions.map((position: iTradePosition, index: number) => {
            const currPriceObj = tickerPrices.find(price => price.symbol === position.symbol);
            if (currPriceObj && currPriceObj.priceUsd !== null) {
                const currPrice = currPriceObj.priceUsd;
                const purchasePrice = position.price;
                const quantity = position.quantity;
                const totalCost = purchasePrice * quantity;
                const currValue = currPrice * quantity;
                const percentageChange = ((currValue - totalCost) / totalCost) * 100;

                totalInitialInvestment += totalCost;
                totalCurrentValue += currValue;

                return {
                    symbol: position.symbol,
                    quantity: quantity,
                    totalCurrentValue: totalCurrentValue,
                    totalInitialInvestment: totalInitialInvestment,
                    purchasePrice: purchasePrice,
                    currentPrice: currPrice,
                    percentageChange: percentageChange,
                    currentValue: currValue,
                    totalCost: totalCost,
                };
            } 
        });
        const overallPercentageChange = ((totalCurrentValue - totalInitialInvestment) / totalInitialInvestment) * 100;
        const PL = totalCurrentValue - totalInitialInvestment;
        user.invested = totalCurrentValue;
        await user.save();
        
        return NextResponse.json({invested: user.invested, overallPercentageChange, PL});

        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
