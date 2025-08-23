import * as z from "zod/v4";
import { ZCardSet } from "./models";

const ZTableData = z.array(ZCardSet);
export type TableData = z.infer<typeof ZTableData>;

export { ZTableData };
