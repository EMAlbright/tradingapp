import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import axios from "axios";

export interface iTradePosition {
    symbol: string;
    quantity: number;
    price: number; 
}

export async function GET(request: NextRequest) {
    await connect();
    try {
        const userID = await getDataFromToken(request);
        const finnhubKey = process.env.NEXT_PUBLIC_FINNHUB_API;
        const user = await User.findOne({ _id: userID });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const positions = user.tradePositions || [];
        const tickerHoldings = positions.map((position: iTradePosition) => position.symbol);

        // Fetch current prices for all symbols
        const tickerPrices = await Promise.all(
            tickerHoldings.map(async (symbol: string) => {
                try {
                    const response = await axios.get(`https://api.coincap.io/v2/assets/${symbol.toLowerCase()}`);
                    return { symbol, priceUsd: parseFloat(response.data.data.priceUsd) }; // Crypto price
                } catch (cryptoError) {
                    console.error(`${symbol}: ${cryptoError}`);
                    try {
                        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`);
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

        const portfolio = positions.map((position: iTradePosition, index: number) => {
            const currPriceObj = tickerPrices.find(price => price.symbol.toUpperCase() === position.symbol.toUpperCase());
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
                    symbol: position.symbol.toUpperCase(),
                    quantity: quantity,
                    purchasePrice: purchasePrice,
                    currentPrice: currPrice,
                    percentageChange: percentageChange,
                    currentValue: currValue,
                    totalCost: totalCost
                };
            } 
        });

        return NextResponse.json({ portfolio, totalInitialInvestment, totalCurrentValue});

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
