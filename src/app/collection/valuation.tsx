import { Card } from "@/lib/types/models";
import { TableData } from "@/lib/types/tableData";
import { TransactionForm } from "@/lib/types/transactionForm";
import { useEffect, useState } from "react";

interface Props {
    tableData: TableData;
    transactions: TransactionForm[];
}

const Valuation: React.FC<Props> = ({ tableData, transactions }) => {
    const [marketValue, setMarketValue] = useState<number>(0);
    const [missingMarket, setMissingMarket] = useState<number>(0);

    const [gradedValue, setGradedValue] = useState<number>(0);
    const [missingGraded, setMissingGraded] = useState<number>(0);

    const [totalPurchasePrice, setTotalPurchasePrice] = useState<number>(0);

    useEffect(() => {
        const cards: Card[] = tableData.map((set) => set.cards).flat();

        if (tableData.length > 0) {
            let marketMissing = 0;
            const newMarketValue = transactions.reduce((curSum, trans) => {
                const theCard: Card | undefined = cards.find(
                    (testCard) => testCard._id === trans.card
                );
                if (theCard === undefined) {
                    marketMissing++;
                    return curSum;
                } else if (theCard.prices[0].tcgMarketPrice === undefined) {
                    marketMissing++;
                    return curSum;
                } else {
                    return curSum + theCard.prices[0].tcgMarketPrice;
                }
            }, 0);
            setMarketValue(newMarketValue);
            setMissingMarket(marketMissing);

            let gradedMissing = 0;
            const newGradedValue = transactions.reduce((curSum, trans) => {
                const theCard: Card | undefined = cards.find(
                    (testCard) => testCard._id === trans.card
                );
                if (theCard === undefined) {
                    gradedMissing++;
                    return curSum;
                } else {
                    switch (trans.grade) {
                        case "10":
                            if (
                                theCard.prices[0].priceChartingGrade10Price ===
                                undefined
                            ) {
                                gradedMissing++;
                                return curSum;
                            } else {
                                return (
                                    curSum +
                                    theCard.prices[0].priceChartingGrade10Price
                                );
                            }
                        case "9.5":
                            if (
                                theCard.prices[0].priceChartingGrade95Price ===
                                undefined
                            ) {
                                gradedMissing++;
                                return curSum;
                            } else {
                                return (
                                    curSum +
                                    theCard.prices[0].priceChartingGrade95Price
                                );
                            }
                        case "9":
                            if (
                                theCard.prices[0].priceChartingGrade9Price ===
                                undefined
                            ) {
                                gradedMissing++;
                                return curSum;
                            } else {
                                return (
                                    curSum +
                                    theCard.prices[0].priceChartingGrade9Price
                                );
                            }
                        case "8":
                            if (
                                theCard.prices[0].priceChartingGrade8Price ===
                                undefined
                            ) {
                                gradedMissing++;
                                return curSum;
                            } else {
                                return (
                                    curSum +
                                    theCard.prices[0].priceChartingGrade8Price
                                );
                            }
                        case "7":
                            if (
                                theCard.prices[0].priceChartingGrade7Price ===
                                undefined
                            ) {
                                gradedMissing++;
                                return curSum;
                            } else {
                                return (
                                    curSum +
                                    theCard.prices[0].priceChartingGrade7Price
                                );
                            }
                        case "Ungraded":
                            if (
                                theCard.prices[0].priceChartingUngradedPrice ===
                                undefined
                            ) {
                                gradedMissing++;
                                return curSum;
                            } else {
                                return (
                                    curSum +
                                    theCard.prices[0].priceChartingUngradedPrice
                                );
                            }
                    }
                }
            }, 0);

            setGradedValue(newGradedValue);
            setMissingGraded(gradedMissing);

            const newPurchasePrice = transactions.reduce(
                (curSum, trans) => curSum + trans.purchasePrice,
                0
            );
            setTotalPurchasePrice(newPurchasePrice);
        }
    }, [tableData, transactions]);

    return (
        <div className="stats border">
            <div className="stat place-items-center">
                <div className="stat-title">Market Value</div>
                <div className="stat-value">${marketValue.toFixed(2)}</div>
                <div className="stat-desc">
                    Counted {transactions.length - missingMarket} of{" "}
                    {transactions.length}
                </div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Graded Value</div>
                <div className="stat-value">${gradedValue.toFixed(2)}</div>
                <div className="stat-desc">
                    Counted {transactions.length - missingGraded} of{" "}
                    {transactions.length}
                </div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Total Purchase Price</div>
                <div className="stat-value">
                    ${totalPurchasePrice.toFixed(2)}
                </div>
                <div className="stat-desc">
                    Counted {transactions.length} of {transactions.length}
                </div>
            </div>
        </div>
    );
};

export default Valuation;
