import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { use } from "react";

export async function POST(request: NextRequest){
    const{symbol, quantity} = await request.json();
    const userID = await getDataFromToken(request);
    const user = await User.findOne({_id:userID});
    
    const finnhubRes =await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API!}`);
    const stockData = await finnhubRes.json();
    const currPrice = stockData.c;
    const total = currPrice * quantity;
    
    if(user.balance < total){
        return NextResponse.json({error: "insufficient balance"})
    }

    user.balance -= total;
    user.positions.push({
        symbol,
        quantity,
        purchasePrice: currPrice
    });
    await user.save();

    return NextResponse.json({ message: "Stock purchased successfully" });
}