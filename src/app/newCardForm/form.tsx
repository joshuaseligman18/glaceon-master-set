"use client";

import { NewCardFormTestResponse } from "@/lib/types/newCardForm";
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from "@tanstack/react-query";
import React, { FormEventHandler, useRef, useState } from "react";
import { createNewCard, runNewCardFormTest } from "./query";

const FormWrapper: React.FC = () => {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <Form />
        </QueryClientProvider>
    );
};

const Form: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const testBtnRef = useRef<HTMLButtonElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);
    const testSuccessSectionRef = useRef<HTMLDivElement>(null);
    const testErrorSectionRef = useRef<HTMLDivElement>(null);
    const submitSuccessSectionRef = useRef<HTMLDivElement>(null);
    const submitErrorSectionRef = useRef<HTMLDivElement>(null);

    const [newCardFormTestRes, setNewCardFormTestRes] =
        useState<NewCardFormTestResponse>({});

    const newCardTestMutation = useMutation({
        mutationFn: runNewCardFormTest,
        onMutate: () => {
            submitBtnRef.current?.classList.add("btn-disabled");
            testBtnRef.current?.classList.add("btn-disabled");
            testSuccessSectionRef.current?.classList.add("hidden");
            testErrorSectionRef.current?.classList.add("hidden");
        },
        onSuccess: (res: NewCardFormTestResponse) => {
            submitBtnRef.current?.classList.remove("btn-disabled");
            testBtnRef.current?.classList.remove("btn-disabled");
            testSuccessSectionRef.current?.classList.remove("hidden");
            testErrorSectionRef.current?.classList.add("hidden");
            setNewCardFormTestRes(res);
        },
        onError: () => {
            submitBtnRef.current?.classList.add("btn-disabled");
            testBtnRef.current?.classList.remove("btn-disabled");
            testSuccessSectionRef.current?.classList.add("hidden");
            testErrorSectionRef.current?.classList.remove("hidden");
        },
    });

    const newCardMutation = useMutation({
        mutationFn: createNewCard,
        onMutate: () => {
            submitBtnRef.current?.classList.add("btn-disabled");
            testBtnRef.current?.classList.add("btn-disabled");
            testSuccessSectionRef.current?.classList.add("hidden");
            testErrorSectionRef.current?.classList.add("hidden");

            submitSuccessSectionRef.current?.classList.add("hidden");
            submitErrorSectionRef.current?.classList.add("hidden");
        },
        onSuccess: () => {
            submitBtnRef.current?.classList.remove("btn-disabled");
            testBtnRef.current?.classList.remove("btn-disabled");
            testSuccessSectionRef.current?.classList.add("hidden");
            testErrorSectionRef.current?.classList.add("hidden");

            formRef.current?.reset();
            submitSuccessSectionRef.current?.classList.remove("hidden");
            setTimeout(() => {
                submitSuccessSectionRef.current?.classList.add("hidden");
            }, 10000);
        },
        onError: () => {
            submitBtnRef.current?.classList.add("btn-disabled");
            testBtnRef.current?.classList.remove("btn-disabled");
            testSuccessSectionRef.current?.classList.add("hidden");
            testErrorSectionRef.current?.classList.remove("hidden");

            submitErrorSectionRef.current?.classList.remove("hidden");
            setTimeout(() => {
                submitErrorSectionRef.current?.classList.add("hidden");
            }, 10000);
        },
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const submitter = (e.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;
        const action = submitter?.value;

        if (action === "test") {
            newCardTestMutation.mutate(
                new FormData(e.target as HTMLFormElement)
            );
        } else if (action === "save") {
            newCardMutation.mutate(new FormData(e.target as HTMLFormElement));
        }
    };

    return (
        <div className="space-y-3">
            <div ref={submitSuccessSectionRef} className="hidden">
                <div role="alert" className="alert alert-success alert-soft">
                    <span>Successfully created the new card.</span>
                </div>
            </div>
            <div ref={submitErrorSectionRef} className="hidden">
                <div role="alert" className="alert alert-error alert-soft">
                    <span>An error occurred when creating the new card.</span>
                </div>
            </div>
            <form
                ref={formRef}
                className="space-y-3"
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
            >
                <div className="flex flex-col space-y-3">
                    <label className="input input-sm">
                        <span className="label">Card name</span>
                        <input
                            type="text"
                            name="cardName"
                            placeholder="Enter a card name"
                            required
                        />
                    </label>
                    <label className="input input-sm">
                        <span className="label">Card number</span>
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="Enter a card number"
                            required
                        />
                    </label>
                    <label className="select select-sm">
                        <span className="label">Card type</span>
                        <select name="cardType" required defaultValue={""}>
                            <option value="" disabled={true}>
                                Select a card type
                            </option>
                            <option value="normal">normal</option>
                            <option value="holofoil">holofoil</option>
                            <option value="reverseHolofoil">
                                reverseHolofoil
                            </option>
                        </select>
                    </label>
                    <div className="space-x-2">
                        <label className="input input-sm">
                            <span className="label">Price Charting URL</span>
                            <input
                                type="url"
                                name="priceChartingUrl"
                                placeholder="Enter a Price Charting URL"
                                onInput={() => {
                                    submitBtnRef.current?.classList.add(
                                        "btn-disabled"
                                    );
                                }}
                                required
                            />
                        </label>
                        <button
                            ref={testBtnRef}
                            className="btn btn-sm btn-secondary"
                            type="submit"
                            name="action"
                            value="test"
                        >
                            Test URL
                        </button>
                    </div>
                    <div ref={testSuccessSectionRef} className="hidden">
                        <div
                            role="alert"
                            className="alert alert-success alert-soft"
                        >
                            <span>
                                Successfully tested the provided URL. Current
                                parsed prices shown below.
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>PSA 10</th>
                                        <th>PSA 9.5</th>
                                        <th>PSA 9</th>
                                        <th>PSA 8</th>
                                        <th>PSA 7</th>
                                        <th>Ungraded</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {newCardFormTestRes.priceChartingGrade10Price?.toFixed(
                                                2
                                            ) ?? "---"}
                                        </td>
                                        <td>
                                            {newCardFormTestRes.priceChartingGrade95Price?.toFixed(
                                                2
                                            ) ?? "---"}
                                        </td>
                                        <td>
                                            {newCardFormTestRes.priceChartingGrade9Price?.toFixed(
                                                2
                                            ) ?? "---"}
                                        </td>
                                        <td>
                                            {newCardFormTestRes.priceChartingGrade8Price?.toFixed(
                                                2
                                            ) ?? "---"}
                                        </td>
                                        <td>
                                            {newCardFormTestRes.priceChartingGrade7Price?.toFixed(
                                                2
                                            ) ?? "---"}
                                        </td>
                                        <td>
                                            {newCardFormTestRes.priceChartingUngradedPrice?.toFixed(
                                                2
                                            ) ?? "---"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div ref={testErrorSectionRef} className="hidden">
                        <div
                            role="alert"
                            className="alert alert-error alert-soft"
                        >
                            <span>
                                An error occurred when testing the provided URL.
                            </span>
                        </div>
                    </div>
                    <div>
                        <button
                            ref={submitBtnRef}
                            className="btn btn-sm btn-accent btn-disabled"
                            type="submit"
                            name="action"
                            value="save"
                        >
                            Add New Card
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormWrapper;
