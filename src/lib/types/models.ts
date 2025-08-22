import * as z from "zod/v4";

const ZPrice = z.object({
    _id: z.string(),
    card: z.string(),
    date: z.iso.datetime().transform((val) => new Date(val)),
    tcgMarketPrice: z.optional(z.float32()),
    priceChartingGrade10Price: z.optional(z.float32()),
    priceChartingGrade7Price: z.optional(z.float32()),
    priceChartingGrade8Price: z.optional(z.float32()),
    priceChartingGrade95Price: z.optional(z.float32()),
    priceChartingGrade9Price: z.optional(z.float32()),
    priceChartingUngradedPrice: z.optional(z.float32()),
});
export type Price = z.infer<typeof ZPrice>;

const ZCard = z.object({
    _id: z.string(),
    cardType: z.enum(["normal", "holofoil", "reverseHolofoil"]),
    cardNumber: z.string(),
    cardSet: z.string(),
    cardName: z.string(),
    imageLink: z.url(),
    pokemonName: z.string(),
    source: z.enum(["api", "manual"]),
    tcgId: z.optional(z.string()),
    prices: z.array(ZPrice).min(1),
});
export type Card = z.infer<typeof ZCard>;

const ZCardSet = z.object({
    _id: z.string(),
    tcgId: z.optional(z.string()),
    name: z.string(),
    priceChartingBaseUrl: z.url(),
    releaseDate: z.iso.datetime().transform((val) => new Date(val)),
    series: z.string(),
    cards: z.array(ZCard),
});
export type CardSet = z.infer<typeof ZCardSet>;

const ZTableData = z.array(ZCardSet);
export type TableData = z.infer<typeof ZTableData>;

export { ZCard, ZCardSet, ZPrice, ZTableData };
