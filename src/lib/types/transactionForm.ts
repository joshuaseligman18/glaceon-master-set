import * as z from "zod/v4";

const ZTransactionForm = z.object({
    _id: z.string().optional(),
    card: z.string(),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}.\d{3}Z)?$/)
        .transform((val) => new Date(val)),
    grade: z.enum(["10", "9.5", "9", "8", "7", "Ungraded"]),
    purchasePrice: z.coerce.number().nonnegative(),
});

export type TransactionForm = z.infer<typeof ZTransactionForm>;

export { ZTransactionForm };
