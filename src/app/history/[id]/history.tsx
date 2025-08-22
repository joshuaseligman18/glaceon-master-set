"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import CardHistoryChart from "./chart";
import { useCardHistoryQuery } from "./query";

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

    return cardHistoryQuery.isFetching ? (
        <p className="text-center">Fetching...</p>
    ) : cardHistoryQuery.isError ? (
        <p className="text-center">
            An error occurred. {cardHistoryQuery.error.message}
        </p>
    ) : (
        <React.Fragment>
            {cardHistoryQuery.data && (
                <CardHistoryChart card={cardHistoryQuery.data} />
            )}
        </React.Fragment>
    );
};

export default CardHistory;
