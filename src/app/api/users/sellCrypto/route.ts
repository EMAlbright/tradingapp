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
    //fix key later
    const coinDataRes = await fetch(`https://api.coincap.io/v2/assets/${symbol}`)
    const coinJson = await coinDataRes.json();
    let currPrice = parseFloat(parseFloat(coinJson.data.priceUsd).toFixed(2)); 
    const sellTotal = currPrice * quantity;
    //get all user positions
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