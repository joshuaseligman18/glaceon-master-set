import * as z from "zod/v4";
import { ZCard, ZCardSet } from "./models";

const ZTableData = z.object({
    apiData: z.array(ZCardSet),
    manualData: z.array(ZCard).min(0),
});
export type TableData = z.infer<typeof ZTableData>;

export { ZTableData };
