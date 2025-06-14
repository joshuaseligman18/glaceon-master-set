import { insertTcgCards } from "@/lib/database/queries/card";
import { insertTcgPlayerPricing } from "@/lib/database/queries/price";
import { collectAndInsertPriceChartingData } from "@/lib/priceCharting/webScraper";
import { fetchTcgCards } from "@/lib/tcgApi/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest): Promise<NextResponse> {
    try {
        const tcgCards = await fetchTcgCards();
        await insertTcgCards(tcgCards);

        await Promise.all([
            insertTcgPlayerPricing(tcgCards),
            collectAndInsertPriceChartingData(),
        ]);

        return NextResponse.json({});
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
