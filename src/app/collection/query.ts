import {
    CollectionPricePoint,
    ZCollectionPricePoint,
} from "@/lib/types/collectionPriceHistory";
import { TableData, ZTableData } from "@/lib/types/tableData";
import { TransactionForm, ZTransactionForm } from "@/lib/types/transactionForm";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import * as z from "zod/v4";

async function fetchPricingData(): Promise<TableData> {
    const res = await fetch("/api/table");
    if (!res.ok) {
        throw new Error("Failed to fetch table data");
    }
    const data = await res.json();
    return ZTableData.parse(data);
}

export function usePriceDataQuery(): UseQueryResult<TableData, Error> {
    return useQuery({
        queryKey: ["usePriceData"],
        queryFn: fetchPricingData,
    });
}

async function fetchTransactions(): Promise<TransactionForm[]> {
    const res = await fetch("/api/transaction");
    if (!res.ok) {
        throw new Error("Failed to fetch table data");
    }
    const resData = await res.json();
    try {
        const data = z.array(ZTransactionForm).parse(resData);
        return data;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

export function useTransactionsQuery(): UseQueryResult<
    TransactionForm[],
    Error
> {
    return useQuery({
        queryKey: ["useTransactions"],
        queryFn: fetchTransactions,
    });
}

export async function submitNewTransaction(newTransaction: FormData) {
    const formData = Object.fromEntries(newTransaction.entries());
    ZTransactionForm.parse(formData);
    const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(
            formData as Record<string, string>
        ).toString(),
    });
    if (!response.ok) {
        throw new Error("Failed to create new transaction");
    }
    return response.json();
}

export async function deleteTransaction(transactionId: string) {
    const response = await fetch(`/api/transaction/${transactionId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete transaction");
    }
    return response.json();
}

async function fetchCollectionPriceHistory(): Promise<CollectionPricePoint[]> {
    const res = await fetch("/api/history/collection");
    if (!res.ok) {
        throw new Error("Failed to fetch collection price history");
    }
    const resData = await res.json();
    try {
        const data = z.array(ZCollectionPricePoint).parse(resData);
        return data;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

export function useCollectionPriceHistoryQuery(): UseQueryResult<
    CollectionPricePoint[],
    Error
> {
    return useQuery({
        queryKey: ["useCollectionPriceHistory"],
        queryFn: fetchCollectionPriceHistory,
    });
}
