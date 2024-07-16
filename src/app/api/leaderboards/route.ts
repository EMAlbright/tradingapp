import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

//possibly user binary heap
export async function GET(request: NextRequest){
    try{
        const users = await User.find({});
        // traverse users and get their net worth.username
        const usersNetworth = users.map(user => ({
            name: user.username,
            networth: user.balance + user.invested
        }));

        //sort users networth 
        usersNetworth.sort((a, b) => b.networth - a.networth);

        //grab top 5
        const topFive = usersNetworth.slice(0, 5);
        return NextResponse.json({
        netWorth: topFive
        });
    } catch(error: any){
        return NextResponse.json({error})
    }
}