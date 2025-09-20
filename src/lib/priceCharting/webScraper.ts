import Card, { ICard } from "@/lib/database/models/card";
import axios from "axios";
import * as cheerio from "cheerio";
import { HydratedDocument } from "mongoose";
import dbConnect from "../database";
import { insertPriceChartingPricing } from "../database/queries/price";

export interface PriceChartingData {
    card?: ICard;
    priceChartingUngradedPrice?: number;
    priceChartingGrade7Price?: number;
    priceChartingGrade8Price?: number;
    priceChartingGrade9Price?: number;
    priceChartingGrade95Price?: number;
    priceChartingGrade10Price?: number;
}

export async function collectAndInsertPriceChartingData(): Promise<void> {
    await dbConnect();

    const cursor = Card.findOne().populate("cardSet").cursor();

    const promiseArr: Promise<PriceChartingData | null>[] = [];
    for await (const card of cursor) {
        promiseArr.push(scrapePriceChartingDataCard(card));
    }

    const priceChartingArr = (await Promise.all(promiseArr)).filter(
        (elem) => elem !== null
    );
    await insertPriceChartingPricing(priceChartingArr);
}

export async function scrapePriceChartingDataCard(
    card: HydratedDocument<ICard>
): Promise<PriceChartingData | null> {
    try {
        let $: cheerio.CheerioAPI;
        if (card.source === "api") {
            let url: string = `${card.cardSet!.priceChartingBaseUrl}/`;
            url += card.cardName.toLowerCase().replaceAll(" ", "-");
            if (card.cardType === "reverseHolofoil") {
                url += "-reverse-holo";
            }
            url += `-${card.cardNumber.toLowerCase()}`;

            const res = await axios.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            });
            const html = res.data;

            $ = cheerio.load(html);

            if ($("#price_data").length === 0) {
                if (card.cardType !== "reverseHolofoil") {
                    return null;
                }

                let url: string = `${card.cardSet!.priceChartingBaseUrl}/`;
                url += card.cardName.toLowerCase().replaceAll(" ", "-");
                if (card.cardType === "reverseHolofoil") {
                    url += "-reverse";
                }
                url += `-${card.cardNumber.toLowerCase()}`;

                const res = await axios.get(url, {
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
                        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    },
                });
                const html = res.data;

                $ = cheerio.load(html);
            }
        } else {
            const res = await axios.get(card.priceChartingUrl!, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            });
            const html = res.data;

            $ = cheerio.load(html);
        }

        const row = $("#price_data")
            .first()
            .children("tbody")
            .first()
            .children("tr")
            .first();

        const newData: PriceChartingData = {
            card: card,
        };
        row.children().each((i, elem) => {
            const price: number = parseFloat(
                $(elem)
                    .children("span")
                    .first()
                    .text()
                    .trim()
                    .substring(1)
                    .replaceAll(",", "")
            );
            if (!isNaN(price)) {
                switch (i) {
                    case 0:
                        newData.priceChartingUngradedPrice = price;
                        break;
                    case 1:
                        newData.priceChartingGrade7Price = price;
                        break;
                    case 2:
                        newData.priceChartingGrade8Price = price;
                        break;
                    case 3:
                        newData.priceChartingGrade9Price = price;
                        break;
                    case 4:
                        newData.priceChartingGrade95Price = price;
                        break;
                    case 5:
                        newData.priceChartingGrade10Price = price;
                        break;
                }
            }
        });

        return newData;
    } catch {
        return null;
    }
}

export async function scrapePriceChartingDataTest(
    url: string
): Promise<PriceChartingData | null> {
    try {
        const res = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        });
        const html = res.data;

        const $ = cheerio.load(html);

        if ($("#price_data").length === 0) {
            return null;
        }

        const row = $("#price_data")
            .first()
            .children("tbody")
            .first()
            .children("tr")
            .first();

        const newData: PriceChartingData = {};
        row.children().each((i, elem) => {
            const price: number = parseFloat(
                $(elem)
                    .children("span")
                    .first()
                    .text()
                    .trim()
                    .substring(1)
                    .replaceAll(",", "")
            );
            if (!isNaN(price)) {
                switch (i) {
                    case 0:
                        newData.priceChartingUngradedPrice = price;
                        break;
                    case 1:
                        newData.priceChartingGrade7Price = price;
                        break;
                    case 2:
                        newData.priceChartingGrade8Price = price;
                        break;
                    case 3:
                        newData.priceChartingGrade9Price = price;
                        break;
                    case 4:
                        newData.priceChartingGrade95Price = price;
                        break;
                    case 5:
                        newData.priceChartingGrade10Price = price;
                        break;
                }
            }
        });

        return newData;
    } catch {
        return null;
    }
}
