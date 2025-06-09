import dbConnect from "..";
import { TcgCard } from "../../tcgApi/types";
import Card from "../models/Card";

export async function insertTcgCards(
    cardsMap: Map<string, TcgCard[]>
): Promise<void> {
    await dbConnect();

    for (const [pokemonName, cards] of cardsMap) {
        const firstCard = cards[0];

        for (const [cardType, pricing] of Object.entries(
            firstCard.tcgplayer.prices
        )) {
            await Card.create({
                source: "api",
                pokemonName: pokemonName,
                tcgId: firstCard.id,
                cardName: firstCard.name,
                cardNumber: firstCard.number,
                imageLink: firstCard.images.small,
                cardType: cardType,
                tcgPlayerMarketPrice: pricing.market,
            });
        }
    }
}
