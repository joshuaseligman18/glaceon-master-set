import { z } from "zod/v4";

export const ZTcgSet = z.object({
    id: z.string(),
    name: z.string(),
    series: z.string(),
});

export type TcgSet = z.infer<typeof ZTcgSet>;

export const ZTcgCard = z.object({
    id: z.string(),
    name: z.string(),
    set: ZTcgSet,
    number: z.string(),
    images: z.object({
        small: z.string(),
    }),
    tcgplayer: z.object({
        updatedAt: z.coerce.date(),
        prices: z.record(
            z.string(),
            z.object({
                market: z.number().positive(),
            })
        ),
    }),
});

export type TcgCard = z.infer<typeof ZTcgCard>;

export const ZTcgResponse = z.object({
    data: z.array(ZTcgCard),
});

export type TcgResponse = z.infer<typeof ZTcgResponse>;
