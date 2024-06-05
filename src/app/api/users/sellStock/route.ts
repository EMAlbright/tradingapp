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
    
    const existingPosition: typeof user.tradePositions[0] | undefined = user.tradePositions.find(
        (position: { symbol: string, quantity: number, price: number }) => position.symbol === symbol
      );
    if(existingPosition){
        if(existingPosition.quantity >= quantity){
            existingPosition.quantity -= quantity;
            //add to balance
            user.balance += sellTotal;
        }
    }
    else{
        console.log("You do not own this stock!");
    }

    await user.save();
    
    return NextResponse.json({ 
        balance: user.balance, 
        tradePosition: {
            symbol,
            quantity,
            price: currPrice
        }
    });
}