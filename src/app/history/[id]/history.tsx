"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import CardHistoryChart from "./chart";
import CardInfo from "./info";
import { useCardHistoryQuery, useCardTransactionsQuery } from "./query";

interface Props {
    id: string;
}

const CardHistory: React.FC<Props> = ({ id }) => {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <CardHistoryContents id={id} />
        </QueryClientProvider>
    );
};

const CardHistoryContents: React.FC<Props> = ({ id }) => {
    const cardHistoryQuery = useCardHistoryQuery(id);
    const cardTransactionsQuery = useCardTransactionsQuery(id);

    return cardHistoryQuery.isFetching || cardTransactionsQuery.isFetching ? (
        <p className="text-center">Fetching...</p>
    ) : cardHistoryQuery.isError ? (
        <p className="text-center">
            An error occurred. {cardHistoryQuery.error.message}
        </p>
    ) : cardTransactionsQuery.isError ? (
        <p className="text-center">
            An error occurred. {cardTransactionsQuery.error.message}
        </p>
    ) : (
        <div className="space-y-5">
            {cardHistoryQuery.data && cardTransactionsQuery.data && (
                <CardInfo
                    card={cardHistoryQuery.data}
                    transactions={cardTransactionsQuery.data}
                />
            )}
            {cardHistoryQuery.data && (
                <CardHistoryChart card={cardHistoryQuery.data} />
            )}
        </div>
    );
};

export default CardHistory;
