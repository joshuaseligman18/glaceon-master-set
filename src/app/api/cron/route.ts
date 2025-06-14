import { insertTcgCards } from "@/lib/database/queries/card";
import { insertTcgPlayerPricing } from "@/lib/database/queries/price";
import { fetchTcgCards } from "@/lib/tcgApi/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest): Promise<NextResponse> {
    try {
        const tcgCards = await fetchTcgCards();
        await insertTcgCards(tcgCards);
        await insertTcgPlayerPricing(tcgCards);

        return NextResponse.json(tcgCards);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
