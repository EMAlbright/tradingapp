import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

export interface iTradePosition {
   symbol: string;
   quantity: number;
   price: number; 
   _id: string;
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

    const positions: iTradePosition[] = user.tradePositions.filter((position: iTradePosition) => position.symbol.toUpperCase() === symbol.toUpperCase());
    const totalQuantity = positions.reduce((sum: number, position: iTradePosition) => sum + position.quantity, 0);

    if (totalQuantity < quantity){
        return NextResponse.json({error: "You do not own enough of this stock!"})
    }

    let remainingQuantity = quantity;
    let profitOrLoss = 0;

    for(let i = 0; i < positions.length && remainingQuantity > 0; i++){
        const position = positions[i];
        const sellQuantity = Math.min(position.quantity, remainingQuantity);

        profitOrLoss += (currPrice - position.price) * sellQuantity;

        position.quantity -= sellQuantity;
        remainingQuantity -= position.quantity;

        //remove from array if q is 0
        if (position.quantity == 0){
            user.tradePositions.pull(position._id);
        }
    }

    user.balance += sellTotal;
    await user.save();

    /**
     * //get all user positions
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
     */
    
    return NextResponse.json({ 
        balance: user.balance, 
        tradePosition: {
            symbol: symbol.toUpperCase(),
            quantity,
            price: currPrice
        }
    });
}