import dbConnect from "@/lib/database";
import Card from "@/lib/database/models/card";
import { TcgCard } from "@/lib/tcgApi/types";
import { AnyBulkWriteOperation } from "mongoose";
import { insertTcgSet } from "./cardSet";

export async function insertTcgCards(
    cardsMap: Map<string, TcgCard[]>
): Promise<void> {
    await dbConnect();

    const cardBulkWriteOperations: AnyBulkWriteOperation[] = [];

    for (const [pokemonName, cards] of cardsMap) {
        for (const card of cards) {
            const set = await insertTcgSet(card.set);

            for (const [cardType, _pricing] of Object.entries(
                card.tcgplayer.prices
            )) {
                const newCard = {
                    source: "api",
                    pokemonName: pokemonName,
                    tcgId: card.id,
                    cardName: card.name,
                    cardNumber: card.number,
                    imageLink: card.images.small,
                    cardType: cardType as
                        | "normal"
                        | "holofoil"
                        | "reverseHolofoil",
                    cardSet: set,
                };

                cardBulkWriteOperations.push({
                    updateOne: {
                        filter: {
                            cardSet: newCard.cardSet,
                            cardNumber: newCard.cardNumber,
                            cardType: newCard.cardType,
                        },
                        update: { $setOnInsert: newCard },
                        upsert: true,
                    },
                });
            }
        }
    }

    await Card.bulkWrite(cardBulkWriteOperations, { ordered: false });
}
