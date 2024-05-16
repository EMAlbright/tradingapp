import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

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

    user.balance += sellTotal;
    //check if user has symbol in a position
    // check if user has the quantity or less than in position
    // if true, execute trade
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