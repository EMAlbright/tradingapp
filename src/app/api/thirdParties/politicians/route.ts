import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';

export async function GET(req: NextRequest) {
    const key = process.env.NEXT_PUBLIC_BEZINGA;
    const url = `https://api.benzinga.com/api/v1/gov/usa/congress/trades?token=${key}`;

    const { searchParams } = new URL(req.url);
    const politicianName = searchParams.get('name')?.toLowerCase();

    try {
        const res = await axios.get(url);
        const data = res.data.data;

        const filteredData = data.filter((trade: any) => 
            trade.filer_info.display_name.toLowerCase() === politicianName
        );

        return NextResponse.json(filteredData);

    } catch (error) {
        return NextResponse.json({ "Error": error });
    }
}
