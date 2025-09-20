import { auth } from "@/auth";
import {
    PriceChartingData,
    scrapePriceChartingDataTest,
} from "@/lib/priceCharting/webScraper";
import { ZNewCardFormTest } from "@/lib/types/newCardForm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json("User is not authenticated", {
                status: 401,
            });
        }

        const data = await req.formData();
        const formData = ZNewCardFormTest.parse(
            Object.fromEntries(data.entries())
        );

        const scrapedData: PriceChartingData | null =
            await scrapePriceChartingDataTest(formData.priceChartingUrl);
        if (scrapedData === null) {
            throw new Error("Failed to scrape the given url");
        }

        return NextResponse.json(scrapedData, { status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(err, { status: 500 });
    }
}
