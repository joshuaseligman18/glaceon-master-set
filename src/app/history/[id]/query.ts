import { Card, ZCard } from "@/lib/types/models";
import {
    QueryFunctionContext,
    UseQueryResult,
    useQuery,
} from "@tanstack/react-query";
import * as z from "zod/v4";

async function fetchCardHistory(context: QueryFunctionContext): Promise<Card> {
    const queryKey = z.array(z.string()).length(2).parse(context.queryKey);

    const res = await fetch(`/api/history/card/${queryKey[1]}`);
    if (!res.ok) {
        throw new Error("Failed to fetch card history data");
    }
    const resData = await res.json();
    try {
        const data = ZCard.parse(resData);
        return data;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

export function useCardHistoryQuery(id: string): UseQueryResult<Card, Error> {
    return useQuery({
        queryKey: ["cardHistory", id],
        queryFn: fetchCardHistory,
    });
}
