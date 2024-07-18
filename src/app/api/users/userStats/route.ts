
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import axios from "axios";

export interface iTradePosition {
    symbol: string;
}

export async function GET(request: NextRequest) {
    await connect();
    try {
        const key = process.env.NEXT_PUBLIC_ROUTE;
        const userID = await getDataFromToken(request);
        const user = await User.findOne({ _id: userID });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        const positions = user.tradePositions || [];
        const tickerHoldings = positions.map((position: iTradePosition) => position.symbol);

        const pythonBackendUrl = `${key}/api/sector`;
        const stockData = await axios.post(pythonBackendUrl, {tickerHoldings});
        const sectorData = stockData.data;
        
        return NextResponse.json({sectorData});

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
