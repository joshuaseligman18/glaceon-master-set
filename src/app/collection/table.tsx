"use client";

import { TableData } from "@/lib/types/tableData";
import { TransactionForm } from "@/lib/types/transactionForm";
import {
    QueryClient,
    QueryClientProvider,
    UseQueryResult,
} from "@tanstack/react-query";
import React from "react";
import CollectionHistoryChart from "./historyChart";
import { usePriceDataQuery, useTransactionsQuery } from "./query";
import CardTransactions from "./transactions";
import Valuation from "./valuation";

const Table: React.FC = () => {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <TableContents />
        </QueryClientProvider>
    );
};

const TableContents: React.FC = () => {
    const dataQuery: UseQueryResult<TableData, Error> = usePriceDataQuery();
    const transactionsQuery: UseQueryResult<TransactionForm[], Error> =
        useTransactionsQuery();

    return dataQuery.isFetching ? (
        <p className="text-center">Fetching...</p>
    ) : dataQuery.isError ? (
        <p className="text-center">
            An error occurred. {dataQuery.error.message}
        </p>
    ) : (
        <React.Fragment>
            {dataQuery.data && transactionsQuery.data && (
                <Valuation
                    tableData={dataQuery.data}
                    transactions={transactionsQuery.data}
                />
            )}
            <CollectionHistoryChart />
            {dataQuery.data &&
                dataQuery.data.map((set) => {
                    return (
                        <div key={set._id} className="my-5">
                            <h1 className="text-md font-bold">
                                {set.name} ({set.series},{" "}
                                {set.releaseDate.getMonth() + 1}/
                                {set.releaseDate.getDate()}/
                                {set.releaseDate.getFullYear()})
                            </h1>
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Number</th>
                                            <th>Type</th>
                                            <th>Source</th>
                                            <th>Market</th>
                                            <th>PSA 10</th>
                                            <th>PSA 9.5</th>
                                            <th>PSA 9</th>
                                            <th>PSA 8</th>
                                            <th>PSA 7</th>
                                            <th>Ungraded</th>
                                            <th>Price History</th>
                                            <th>Transactions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {set.cards.map((card) => {
                                            const marketDiff =
                                                card.prices.length === 2 &&
                                                card.prices[0].tcgMarketPrice &&
                                                card.prices[1].tcgMarketPrice
                                                    ? card.prices[0]
                                                          .tcgMarketPrice -
                                                      card.prices[1]
                                                          .tcgMarketPrice
                                                    : null;

                                            const psa10Diff =
                                                card.prices.length === 2 &&
                                                card.prices[0]
                                                    .priceChartingGrade10Price &&
                                                card.prices[1]
                                                    .priceChartingGrade10Price
                                                    ? card.prices[0]
                                                          .priceChartingGrade10Price -
                                                      card.prices[1]
                                                          .priceChartingGrade10Price
                                                    : null;

                                            const psa95Diff =
                                                card.prices.length === 2 &&
                                                card.prices[0]
                                                    .priceChartingGrade95Price &&
                                                card.prices[1]
                                                    .priceChartingGrade95Price
                                                    ? card.prices[0]
                                                          .priceChartingGrade95Price -
                                                      card.prices[1]
                                                          .priceChartingGrade95Price
                                                    : null;

                                            const psa9Diff =
                                                card.prices.length === 2 &&
                                                card.prices[0]
                                                    .priceChartingGrade9Price &&
                                                card.prices[1]
                                                    .priceChartingGrade9Price
                                                    ? card.prices[0]
                                                          .priceChartingGrade9Price -
                                                      card.prices[1]
                                                          .priceChartingGrade9Price
                                                    : null;

                                            const psa8Diff =
                                                card.prices.length === 2 &&
                                                card.prices[0]
                                                    .priceChartingGrade8Price &&
                                                card.prices[1]
                                                    .priceChartingGrade8Price
                                                    ? card.prices[0]
                                                          .priceChartingGrade8Price -
                                                      card.prices[1]
                                                          .priceChartingGrade8Price
                                                    : null;

                                            const psa7Diff =
                                                card.prices.length === 2 &&
                                                card.prices[0]
                                                    .priceChartingGrade7Price &&
                                                card.prices[1]
                                                    .priceChartingGrade7Price
                                                    ? card.prices[0]
                                                          .priceChartingGrade7Price -
                                                      card.prices[1]
                                                          .priceChartingGrade7Price
                                                    : null;

                                            const ungradedDiff =
                                                card.prices.length === 2 &&
                                                card.prices[0]
                                                    .priceChartingUngradedPrice &&
                                                card.prices[1]
                                                    .priceChartingUngradedPrice
                                                    ? card.prices[0]
                                                          .priceChartingUngradedPrice -
                                                      card.prices[1]
                                                          .priceChartingUngradedPrice
                                                    : null;

                                            return (
                                                <tr key={card._id}>
                                                    <td>{card.cardName}</td>
                                                    <td>{card.cardNumber}</td>
                                                    <td>{card.cardType}</td>
                                                    <td>{card.source}</td>
                                                    <td>
                                                        <span>
                                                            {card.prices[0]
                                                                .tcgMarketPrice
                                                                ? card.prices[0].tcgMarketPrice.toFixed(
                                                                      2
                                                                  )
                                                                : "---"}
                                                        </span>
                                                        {marketDiff !== null ? (
                                                            <span
                                                                className={
                                                                    marketDiff <
                                                                    0
                                                                        ? "ml-3 text-success"
                                                                        : "ml-3 text-error"
                                                                }
                                                            >
                                                                (
                                                                {marketDiff.toFixed(
                                                                    2
                                                                )}
                                                                )
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {card.prices[0]
                                                                .priceChartingGrade10Price
                                                                ? card.prices[0].priceChartingGrade10Price.toFixed(
                                                                      2
                                                                  )
                                                                : "---"}
                                                        </span>
                                                        {psa10Diff !== null ? (
                                                            <span
                                                                className={
                                                                    psa10Diff <
                                                                    0
                                                                        ? "ml-3 text-success"
                                                                        : "ml-3 text-error"
                                                                }
                                                            >
                                                                (
                                                                {psa10Diff.toFixed(
                                                                    2
                                                                )}
                                                                )
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {card.prices[0]
                                                                .priceChartingGrade95Price
                                                                ? card.prices[0].priceChartingGrade95Price.toFixed(
                                                                      2
                                                                  )
                                                                : "---"}
                                                        </span>
                                                        {psa95Diff !== null ? (
                                                            <span
                                                                className={
                                                                    psa95Diff <
                                                                    0
                                                                        ? "ml-3 text-success"
                                                                        : "ml-3 text-error"
                                                                }
                                                            >
                                                                (
                                                                {psa95Diff.toFixed(
                                                                    2
                                                                )}
                                                                )
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {card.prices[0]
                                                                .priceChartingGrade9Price
                                                                ? card.prices[0].priceChartingGrade9Price.toFixed(
                                                                      2
                                                                  )
                                                                : "---"}
                                                        </span>
                                                        {psa9Diff !== null ? (
                                                            <span
                                                                className={
                                                                    psa9Diff < 0
                                                                        ? "ml-3 text-success"
                                                                        : "ml-3 text-error"
                                                                }
                                                            >
                                                                (
                                                                {psa9Diff.toFixed(
                                                                    2
                                                                )}
                                                                )
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {card.prices[0]
                                                                .priceChartingGrade8Price
                                                                ? card.prices[0].priceChartingGrade8Price.toFixed(
                                                                      2
                                                                  )
                                                                : "---"}
                                                        </span>
                                                        {psa8Diff !== null ? (
                                                            <span
                                                                className={
                                                                    psa8Diff < 0
                                                                        ? "ml-3 text-success"
                                                                        : "ml-3 text-error"
                                                                }
                                                            >
                                                                (
                                                                {psa8Diff.toFixed(
                                                                    2
                                                                )}
                                                                )
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {card.prices[0]
                                                                .priceChartingGrade7Price
                                                                ? card.prices[0].priceChartingGrade7Price.toFixed(
                                                                      2
                                                                  )
                                                                : "---"}
                                                        </span>
                                                        {psa7Diff !== null ? (
                                                            <span
                                                                className={
                                                                    psa7Diff < 0
                                                                        ? "ml-3 text-success"
                                                                        : "ml-3 text-error"
                                                                }
                                                            >
                                                                (
                                                                {psa7Diff.toFixed(
                                                                    2
                                                                )}
                                                                )
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {card.prices[0]
                                                                .priceChartingUngradedPrice
                                                                ? card.prices[0].priceChartingUngradedPrice.toFixed(
                                                                      2
                                                                  )
                                                                : "---"}
                                                        </span>
                                                        {ungradedDiff !==
                                                        null ? (
                                                            <span
                                                                className={
                                                                    ungradedDiff <
                                                                    0
                                                                        ? "ml-3 text-success"
                                                                        : "ml-3 text-error"
                                                                }
                                                            >
                                                                (
                                                                {ungradedDiff.toFixed(
                                                                    2
                                                                )}
                                                                )
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td>
                                                        <a
                                                            href={`/history/${card._id}`}
                                                        >
                                                            <svg
                                                                className="size-[2em]"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 -960 960 960"
                                                            >
                                                                <g
                                                                    strokeLinejoin="round"
                                                                    strokeLinecap="round"
                                                                    strokeWidth="2"
                                                                    fill="currentColor"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path d="m296-320 122-122 80 80 142-141v63h80v-200H520v80h63l-85 85-80-80-178 179 56 56Zm-96 200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                                                                </g>
                                                            </svg>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <CardTransactions
                                                            transactionsQuery={
                                                                transactionsQuery
                                                            }
                                                            card={card}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
        </React.Fragment>
    );
};

export default Table;
