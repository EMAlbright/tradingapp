import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

export interface iTradePosition {
   symbol: string;
   quantity: number;
   price: number; 
}

export async function POST(request: NextRequest){
    const{symbol, quantity} = await request.json();
    const userID = await getDataFromToken(request);
    const user = await User.findOne({_id:userID});
    const key = process.env.NEXT_PUBLIC_FINNHUB_API;
    //fix key later
    const finnhubRes =await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`);
    const stockData = await finnhubRes.json();
    const currPrice = stockData.c;
    const sellTotal = currPrice * quantity;
    
    const position = user.tradePosition.find((position: iTradePosition) => position.symbol === symbol);

    // if true, execute trade
    if(!position || position.quantity < quantity){
        return NextResponse.json({error: "error, not enough stock"})
    }

    position.quantity -= quantity;

    // If the quantity drops to zero, remove the trade position
    if (position.quantity === 0) {
        user.tradePositions = user.tradePositions.filter((position: iTradePosition) => position.symbol !== symbol);
    }
    /* user.tradePositions.push({
        position: 'sell',
        symbol,
        quantity,
        price: currPrice
    });  */

    //add to balance
    user.balance += sellTotal;

    await user.save();
    console.log(user.balance);
    return NextResponse.json({ 
        balance: user.balance, 
        tradePosition: {
            symbol,
            quantity,
            price: currPrice
        }
    });
}