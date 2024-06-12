import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import axios from "axios";
connect();
// get the holdings of the user
//display any stocks owned
// purchase price
// current price of stock
// percentage increase or decrease of total port + that singular position

export interface iTradePosition {
    symbol: string;
    quantity: number;
    price: number; 
 }

export async function GET(request: NextRequest){
    try {
        const userID = await getDataFromToken(request);
        const key = process.env.NEXT_PUBLIC_FINNHUB_API;
        const user = await User.findOne({_id:userID});
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }

        const positions = user.tradePositions || [];
        const tickerHoldings = positions.map((position: iTradePosition) => position.symbol)
        // Fetch current prices for all symbols
        const tickerPrices = await Promise.all(
            tickerHoldings.map((symbol: string) => 
                axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`)
            )
        );

        const currPrices = tickerPrices.map(response => response.data.c);
        
        const portfolio = positions.map((position: iTradePosition, index: number) =>{
            const currPrice = currPrices[index];
            const purchasePrice = position.price;
            const quantity = position.quantity;
            const totalCost = purchasePrice * quantity;
            const currValue = currPrice * quantity;
            const percentageChange = ((currValue - totalCost) / totalCost) * 100;

            return{
                symbol: position.symbol,
                quantity: quantity,
                purchasePrice: purchasePrice,
                currentPrice: currPrice,
                percentageChange: percentageChange,
                currentValue: currValue
            };
        });
        console.log(portfolio);
        return NextResponse.json(portfolio);
    
    }
        catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
