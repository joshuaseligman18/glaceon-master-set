import dbConnect from "@/lib/database";
import Card from "@/lib/database/models/card";
import { TcgCard } from "@/lib/tcgApi/types";
import { AnyBulkWriteOperation } from "mongoose";
import { insertTcgSet } from "./cardSet";

export async function insertTcgCards(
    cardsMap: Map<string, TcgCard[]>
): Promise<void> {
    await dbConnect();

    const cardBulkWritePromises: Promise<AnyBulkWriteOperation[]>[] = [];
    for (const [pokemonName, cards] of cardsMap) {
        for (const card of cards) {
            cardBulkWritePromises.push(
                (async () => {
                    const set = await insertTcgSet(card.set);

                    const resOperations: AnyBulkWriteOperation[] = [];

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

                        resOperations.push({
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
                    return resOperations;
                })()
            );
        }
    }

    const cardBulkWriteOperations: AnyBulkWriteOperation[] = (
        await Promise.all(cardBulkWritePromises)
    ).flat();
    await Card.bulkWrite(cardBulkWriteOperations, { ordered: false });
}
