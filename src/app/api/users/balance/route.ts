import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest){
    try{
        const userID = await getDataFromToken(request);
        const user = await User.findOne({_id:userID}); 
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }
      
          return NextResponse.json({ balance: user.balance });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
