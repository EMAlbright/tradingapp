import { NextResponse } from "next/server";
import axios from 'axios';

export async function GET(){
    const key = process.env.FINANCIAL_MODELING;
    const url = `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${key}`;

    try {
        const res = await axios.get(url);
        const data = res.data;

        const tenYear = data['data'][0];
        return NextResponse.json(tenYear);

    } catch(error){
        return NextResponse.json({"Error:" : error})
    }

}