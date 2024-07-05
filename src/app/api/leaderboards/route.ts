import { NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

export async function POST(request: NextRequest){
    const userID = await getDataFromToken(request);
    let users = []
    users = await User.findOne({_id: userID})
}