import { TcgSet } from "@/lib/tcgApi/types";
import { HydratedDocument } from "mongoose";
import dbConnect from "..";
import CardSet, { ICardSet } from "../models/cardSet";

export async function insertTcgSet(set: TcgSet): Promise<ICardSet> {
    await dbConnect();

    const foundDocument: HydratedDocument<ICardSet> = await CardSet.findOne({
        tcgId: set.id,
    }).exec();
    if (!foundDocument) {
        let baseUrl: string = "https://www.pricecharting.com/game/pokemon-";

        let setName: string = set.name;

        if (setName.includes("Promo")) {
            setName = "promo";
        } else if (setName.includes("Crown Zenith")) {
            setName = "Crown Zenith";
        } else if (setName.includes("Hidden Fates")) {
            setName = "Hidden Fates";
        }

        baseUrl += setName.toLowerCase().replaceAll(" ", "-");

        const newCardSet: HydratedDocument<ICardSet> = await CardSet.create({
            tcgId: set.id,
            name: set.name,
            series: set.series,
            releaseDate: set.releaseDate,
            priceChartingBaseUrl: baseUrl,
        });
        return newCardSet;
    } else {
        return foundDocument;
    }
}
