import { Card } from "@/lib/types/tableData";
import { TransactionForm } from "@/lib/types/transactionForm";
import {
    UseQueryResult,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import React, { FormEventHandler } from "react";
import { deleteTransaction, submitNewTransaction } from "./query";

interface Props {
    transactionsQuery: UseQueryResult<TransactionForm[], Error>;
    card: Card;
}

const CardTransactions: React.FC<Props> = ({ transactionsQuery, card }) => {
    const client = useQueryClient();

    const newTransactionMutation = useMutation({
        mutationFn: submitNewTransaction,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["useTransactions"] });
        },
        onError: (err) => {
            console.error(err);
        },
    });

    const handleNewTransaction: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        newTransactionMutation.mutate(
            new FormData(e.target as HTMLFormElement)
        );
    };

    const deleteTransactionMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["useTransactions"] });
        },
        onError: (err) => {
            console.error(err);
        },
    });

    function handleDeleteRequest(transaction: TransactionForm) {
        const deleteConfirmation: boolean = confirm(
            `Are you sure you want to delete the transaction for ${card.cardName} #${card.cardNumber} (${card.cardType})? (Grade: ${transaction.grade}; Purchase date: ${transaction.date.toLocaleDateString()}; Purchase price: $${transaction.purchasePrice.toFixed(2)})`
        );
        if (deleteConfirmation) {
            deleteTransactionMutation.mutate(transaction._id!);
        }
    }

    return (
        <div className="drawer drawer-end">
            <input
                id={`transaction-drawer-${card._id}`}
                type="checkbox"
                className="drawer-toggle"
            />
            <div className="drawer-content">
                <div className="indicator">
                    {transactionsQuery.isSuccess &&
                    transactionsQuery.data.filter(
                        (trans) => trans.card === card._id
                    ).length > 0 ? (
                        <span className="indicator-item badge badge-xs badge-secondary">
                            {
                                transactionsQuery.data.filter(
                                    (trans) => trans.card === card._id
                                ).length
                            }
                        </span>
                    ) : (
                        ""
                    )}
                    <label
                        htmlFor={`transaction-drawer-${card._id}`}
                        className="drawer-button cursor-pointer"
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
                                <path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z" />
                            </g>
                        </svg>
                    </label>
                </div>
            </div>
            <div className="drawer-side z-999">
                <label
                    htmlFor={`transaction-drawer-${card._id}`}
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                {transactionsQuery.isFetching ? (
                    <p className="text-center">Fetching...</p>
                ) : transactionsQuery.isError ? (
                    <p className="text-center">
                        An error occurred. {transactionsQuery.error.message}
                    </p>
                ) : (
                    <div className="bg-base-200 text-base-content min-h-full w-80 p-3">
                        <h1 className="text-xl font-bold my-2">
                            {card.cardName} #{card.cardNumber} ({card.cardType})
                        </h1>
                        <form
                            onSubmit={handleNewTransaction}
                            className="space-y-2"
                        >
                            <input type="hidden" name="card" value={card._id} />
                            <label className="select select-sm">
                                <span className="label">Card grade</span>
                                <select name="grade" required defaultValue={""}>
                                    <option value="" disabled={true}>
                                        Select a card grade
                                    </option>
                                    <option value="10">PSA 10</option>
                                    <option value="9.5">PSA 9.5</option>
                                    <option value="9">PSA 9</option>
                                    <option value="8">PSA 8</option>
                                    <option value="7">PSA 7</option>
                                    <option value="Ungraded">Ungraded</option>
                                </select>
                            </label>
                            <label className="input">
                                <span className="label">Purchase date</span>
                                <input name="date" type="date" required />
                            </label>
                            <label className="input">
                                <span className="label">Purchase price</span>
                                <input
                                    name="purchasePrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </label>
                            <button
                                type="submit"
                                className="btn btn-xs btn-primary w-full"
                                disabled={newTransactionMutation.isPending}
                            >
                                Add transaction
                            </button>
                        </form>
                        {transactionsQuery.data &&
                        transactionsQuery.data.filter(
                            (trans) => trans.card === card._id
                        ).length > 0 ? (
                            <React.Fragment>
                                <div className="divider"></div>
                                <div className="space-y-3">
                                    {transactionsQuery.data
                                        .filter(
                                            (trans) => trans.card === card._id
                                        )
                                        .map((trans) => {
                                            return (
                                                <div
                                                    key={trans._id!}
                                                    className="card card-sm border-solid border-primary-content border-1"
                                                >
                                                    <div className="card-body">
                                                        <h2 className="card-title">
                                                            {trans.date.toLocaleDateString()}
                                                        </h2>
                                                        <p>
                                                            Grade: {trans.grade}
                                                            ; Price: $
                                                            {trans.purchasePrice.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                        <div className="card-actions justify-end">
                                                            <button
                                                                className="btn btn-xs btn-error"
                                                                onClick={() =>
                                                                    handleDeleteRequest(
                                                                        trans
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </React.Fragment>
                        ) : (
                            ""
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardTransactions;
