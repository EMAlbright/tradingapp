import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
    const {symbol, quantity, position} = await req.json();
    const userID = await getDataFromToken(req);
    const user = await User.findOne({_id: userID});

    const coinDataRes = await fetch(`https://api.coincap.io/v2/assets/${symbol}`)
    const coinJson = await coinDataRes.json();
    let currPrice = parseFloat(parseFloat(coinJson.data.priceUsd).toFixed(2)); 
    let total = quantity * currPrice;
   
    if (user.balance < total){
        return NextResponse.json({error: "Insufficient Balance"})
    }

    const existingPosition: typeof user.tradePositions[0] | undefined = user.tradePositions.find(
        (position: { symbol: string, quantity: number, price: number }) => position.symbol === symbol
      );
    if(existingPosition && existingPosition.price == currPrice){
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