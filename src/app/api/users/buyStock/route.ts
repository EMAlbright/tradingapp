import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { use } from "react";
import { connect } from "@/dbConfig/dbConfig";

connect();
export async function POST(request: NextRequest){
    const{symbol, quantity, position} = await request.json();
    const userID = await getDataFromToken(request);
    const user = await User.findOne({_id:userID});
    const key = process.env.NEXT_PUBLIC_FINNHUB_API;
    //fix key later
    const finnhubRes =await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`);
    const stockData = await finnhubRes.json();
    const currPrice = stockData.c;
    const total = currPrice * quantity;
    
    if(user.balance < total){
        return NextResponse.json({error: "insufficient balance"})
    }
    //check if user has the symbol/ticker already
    const existingPosition: typeof user.tradePositions[0] | undefined = user.tradePositions.find(
        (position: { symbol: string, quantity: number, price: number }) => position.symbol === symbol
      );
    if(existingPosition){
        existingPosition.quantity += quantity;
    }
    else {
        // Add new trade position
        user.tradePositions.push({
            symbol,
            quantity,
            price: currPrice
    });
    }
    user.balance -= total;

    await user.save();
    console.log(user.balance);
    return NextResponse.json({ 
        balance: user.balance, 
        tradePosition: {
            position: position,
            symbol: symbol,
            quantity: quantity,
            price: currPrice
        }
    });
}