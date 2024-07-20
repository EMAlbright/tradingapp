import axios from "axios";
import { NextResponse } from "next/server";
export async function GET(){
    const key = process.env.NEWS_API;
    const url = `https://newsapi.org/v2/everything?q=stocks&language=en&sortBy=publishedAt&apiKey=${key}`;

    try {
        const res = await axios.get(url);
        const data = res.data;
        return NextResponse.json(data);

    } catch(error){
        return NextResponse.json({"Error:" : error})
    }

}