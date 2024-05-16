import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { use } from "react";

export async function POST(request: NextRequest){
    const{symbol, quantity} = await request.json();
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

    user.balance -= total;
    
    user.tradePositions.push({
        symbol,
        quantity,
        price: currPrice
    }); 

    await user.save();
    console.log(user.balance);
    return NextResponse.json({ 
        balance: user.balance, 
        tradePosition: {
            symbol: symbol,
            quantity: quantity,
            price: currPrice
        }
    });
}