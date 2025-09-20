import * as z from "zod/v4";

const ZNewCardFormTest = z.object({
    priceChartingUrl: z.url(),
});
export type NewCardFormTest = z.infer<typeof ZNewCardFormTest>;

const ZNewCardFormTestResponse = z.object({
    priceChartingUngradedPrice: z.number().optional(),
    priceChartingGrade7Price: z.number().optional(),
    priceChartingGrade8Price: z.number().optional(),
    priceChartingGrade9Price: z.number().optional(),
    priceChartingGrade95Price: z.number().optional(),
    priceChartingGrade10Price: z.number().optional(),
});
export type NewCardFormTestResponse = z.infer<typeof ZNewCardFormTestResponse>;

const ZNewCardForm = z.object({
    cardName: z.string(),
    cardNumber: z.string(),
    cardType: z.enum(["normal", "holofoil", "reverseHolofoil"]),
    priceChartingUrl: z.url(),
});
export type NewCardForm = z.infer<typeof ZNewCardForm>;

export { ZNewCardForm, ZNewCardFormTest, ZNewCardFormTestResponse };
