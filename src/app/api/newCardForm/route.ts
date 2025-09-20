import { auth } from "@/auth";
import Card from "@/lib/database/models/card";
import { insertPriceChartingPricing } from "@/lib/database/queries/price";
import { scrapePriceChartingDataCard } from "@/lib/priceCharting/webScraper";
import { ZNewCardForm } from "@/lib/types/newCardForm";
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
        const formData = ZNewCardForm.parse(Object.fromEntries(data.entries()));

        const newCard = await Card.create({
            source: "manual",
            cardName: formData.cardName,
            cardNumber: formData.cardNumber,
            cardType: formData.cardType,
            priceChartingUrl: formData.priceChartingUrl,
            createdBy: session.user!.id,
        });

        const newPricingData = await scrapePriceChartingDataCard(newCard);
        await insertPriceChartingPricing([newPricingData!]);

        return NextResponse.json(newCard, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(err, { status: 500 });
    }
}
