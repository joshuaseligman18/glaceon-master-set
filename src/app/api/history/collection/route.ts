import { auth } from "@/auth";
import dbConnect from "@/lib/database";
import Price, { IPrice } from "@/lib/database/models/price";
import Transaction, { ITransaction } from "@/lib/database/models/transaction";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();
        const session = await auth();
        if (!session) {
            return NextResponse.json("User is not authenticated", {
                status: 401,
            });
        }

        const userTransactions: HydratedDocument<ITransaction>[] =
            await Transaction.find({ user: session.user!.id });

        const cmpDate: Date = new Date();
        cmpDate.setDate(cmpDate.getDate() - 90);
        const pricingPromises: Promise<HydratedDocument<IPrice>[]>[] =
            userTransactions.map(
                async (trans): Promise<HydratedDocument<IPrice>[]> =>
                    await Price.find({
                        card: trans.card._id,
                        date: { $gt: cmpDate },
                    }).sort({ date: 1 })
            );

        const pricesList: HydratedDocument<IPrice>[][] =
            await Promise.all(pricingPromises);

        const priceMap: Map<number, number> = new Map<number, number>();
        for (const [i, priceGroup] of pricesList.entries()) {
            for (const price of priceGroup.filter(
                (p) => p.date >= userTransactions[i].date
            )) {
                if (!priceMap.has(price.date.getTime())) {
                    priceMap.set(price.date.getTime(), 0);
                }

                switch (userTransactions[i].grade) {
                    case "10":
                        priceMap.set(
                            price.date.getTime(),
                            priceMap.get(price.date.getTime())! +
                                (price.priceChartingGrade10Price ??
                                    price.tcgMarketPrice ??
                                    0)
                        );
                        break;
                    case "9.5":
                        priceMap.set(
                            price.date.getTime(),
                            priceMap.get(price.date.getTime())! +
                                (price.priceChartingGrade95Price ??
                                    price.tcgMarketPrice ??
                                    0)
                        );
                        break;
                    case "9":
                        priceMap.set(
                            price.date.getTime(),
                            priceMap.get(price.date.getTime())! +
                                (price.priceChartingGrade9Price ??
                                    price.tcgMarketPrice ??
                                    0)
                        );
                        break;
                    case "8":
                        priceMap.set(
                            price.date.getTime(),
                            priceMap.get(price.date.getTime())! +
                                (price.priceChartingGrade8Price ??
                                    price.tcgMarketPrice ??
                                    0)
                        );
                        break;
                    case "7":
                        priceMap.set(
                            price.date.getTime(),
                            priceMap.get(price.date.getTime())! +
                                (price.priceChartingGrade7Price ??
                                    price.tcgMarketPrice ??
                                    0)
                        );
                        break;
                    case "Ungraded":
                        priceMap.set(
                            price.date.getTime(),
                            priceMap.get(price.date.getTime())! +
                                (price.priceChartingUngradedPrice ??
                                    price.tcgMarketPrice ??
                                    0)
                        );
                        break;
                }
            }
        }

        const serializedPriceMap = Array.from(priceMap.entries())
            .map(([date, value]) => ({
                date,
                value,
            }))
            .sort((a, b) => a.date - b.date);

        return NextResponse.json(serializedPriceMap);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
