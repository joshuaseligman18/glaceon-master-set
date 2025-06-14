import Card, { ICard } from "@/lib/database/models/card";
import Price from "@/lib/database/models/price";
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
                const dbCard: HydratedDocument<ICard> = await Card.findOne({
                    cardNumber: card.number,
                    cardType: cardType,
                })
                    .populate({
                        path: "cardSet",
                        match: { tcgId: card.set.id },
                    })
                    .where("cardSet")
                    .ne(null);

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

    await Price.bulkWrite(pricesBulkWriteOperations, { ordered: false });
}
