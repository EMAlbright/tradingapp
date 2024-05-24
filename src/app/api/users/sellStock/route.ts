import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import BuyStockPage from "@/app/buyStock/page";

interface TradePosition {
    position: 'buy' | 'sell';
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

    //check if user has enough stock
    const buyPosition = user.tradePositions.find((position: TradePosition) => 
        position.symbol === symbol && position.position === 'buy' && position.quantity >= quantity
    );    
    
    buyPosition.quantity -= quantity;
    
    if (buyPosition.quantity === 0) {
        user.tradePositions = user.tradePositions.filter((position: TradePosition) => position !== buyPosition);
    }
    // if true, execute trade
    user.tradePositions.push({
        position: 'sell',
        symbol,
        quantity,
        price: currPrice
    }); 

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