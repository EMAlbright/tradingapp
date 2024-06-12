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
        const key = process.env.NEXT_PUBLIC_FINNHUB_API;

        const positions = user.tradePositions || [];
        // Fetch current prices for all symbols
        const tickerPrices = await Promise.all(
            positions.map((position: iTradePosition) => 
                axios.get(`https://finnhub.io/api/v1/quote?symbol=${position.symbol}&token=${key}`)
            )
        );

        const currPrices = tickerPrices.map(response => response.data.c);
        
        let total = 0;
        positions.forEach((position: iTradePosition, index: number) =>{
            const currPrice = currPrices[index];
            const quantity = position.quantity;
            const currentValue = currPrice * quantity
            const originalValue = position.price * quantity;

            total += currentValue - originalValue;
        });

        user.invested += total;
        await user.save();
        
        return NextResponse.json({invested: user.invested});

        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
