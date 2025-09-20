import * as z from "zod/v4";

const ZCollectionPricePoint = z.object({
    date: z.number().transform((val) => new Date(val)),
    value: z.number().nonnegative(),
});
export type CollectionPricePoint = z.infer<typeof ZCollectionPricePoint>;

export { ZCollectionPricePoint };
