
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
        const userID = await getDataFromToken(request);
        const user = await User.findOne({ _id: userID });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        const positions = user.tradePositions || [];
        const tickerHoldings = positions.map((position: iTradePosition) => position.symbol);

        const pythonBackendUrl = 'http://localhost:8000/api/sector';
        const stockData = await axios.post(pythonBackendUrl, {tickerHoldings});
        const sectorData = stockData.data;
        
        return NextResponse.json({sectorData});

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
