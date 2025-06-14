import Card, { ICard } from "@/lib/database/models/card";
import Price from "@/lib/database/models/price";
import { PriceChartingData } from "@/lib/priceCharting/webScraper";
import { TcgCard } from "@/lib/tcgApi/types";
import { AnyBulkWriteOperation, HydratedDocument } from "mongoose";
import dbConnect from "..";

export async function insertTcgPlayerPricing(
    cardsMap: Map<string, TcgCard[]>
): Promise<void> {
    await dbConnect();

    const pricesBulkWriteOperations: AnyBulkWriteOperation[] = [];
    const now: Date = new Date();
    const today: Date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    for (const [_pokemonName, cards] of cardsMap) {
        for (const card of cards) {
            for (const [cardType, pricing] of Object.entries(
                card.tcgplayer.prices
            )) {
                const dbCard: HydratedDocument<ICard> | null =
                    await Card.findOne({
                        cardNumber: card.number,
                        cardType: cardType,
                    })
                        .populate({
                            path: "cardSet",
                            match: { tcgId: card.set.id },
                        })
                        .where("cardSet")
                        .ne(null);

                if (dbCard) {
                    pricesBulkWriteOperations.push({
                        updateOne: {
                            filter: {
                                card: dbCard,
                                date: today,
                            },
                            update: {
                                $set: {
                                    tcgMarketPrice: pricing.market,
                                },
                            },
                            upsert: true,
                        },
                    });
                }
            }
        }
    }

    await Price.bulkWrite(pricesBulkWriteOperations, { ordered: false });
}

export async function insertPriceChartingPricing(
    pricingData: PriceChartingData[]
): Promise<void> {
    await dbConnect();

    const now: Date = new Date();
    const today: Date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const pricesBulkWriteOperations: AnyBulkWriteOperation[] = pricingData.map(
        (cardPricing) => {
            return {
                updateOne: {
                    filter: {
                        card: cardPricing.card,
                        date: today,
                    },
                    update: {
                        $set: {
                            priceChartingUngradedPrice:
                                cardPricing.priceChartingUngradedPrice,
                            priceChartingGrade7Price:
                                cardPricing.priceChartingGrade7Price,
                            priceChartingGrade8Price:
                                cardPricing.priceChartingGrade8Price,
                            priceChartingGrade9Price:
                                cardPricing.priceChartingGrade9Price,
                            priceChartingGrade95Price:
                                cardPricing.priceChartingGrade95Price,
                            priceChartingGrade10Price:
                                cardPricing.priceChartingGrade10Price,
                        },
                    },
                    upsert: true,
                },
            };
        }
    );

    await Price.bulkWrite(pricesBulkWriteOperations, { ordered: false });
}
