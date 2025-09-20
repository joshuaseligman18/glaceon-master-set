import { Card } from "@/lib/types/models";
import { TransactionForm } from "@/lib/types/transactionForm";
import Image from "next/image";

interface Props {
    card: Card;
    transactions: TransactionForm[];
}

const CardInfo: React.FC<Props> = ({ card, transactions }) => {
    return (
        <div className="flex flex-row space-x-5">
            {card.imageLink && (
                <Image
                    src={card.imageLink}
                    alt="Picture of the card"
                    width={245}
                    height={342}
                />
            )}
            <div className="border-1 p-3 w-full space-y-3">
                <div>
                    <h2 className="font-bold text-xl">Info</h2>
                    <ul className="list-disc list-inside">
                        <li>
                            Card: {card.cardName} #{card.cardNumber}
                        </li>
                        <li>Type: {card.cardType}</li>
                    </ul>
                </div>
                <div>
                    <h2 className="font-bold text-xl">Transactions</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Purchase Date</th>
                                    <th>Grade</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center">
                                            No transactions
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((trans) => {
                                        return (
                                            <tr key={trans._id}>
                                                <td>
                                                    {trans.date.toDateString()}
                                                </td>
                                                <td>{trans.grade}</td>
                                                <td>
                                                    {new Intl.NumberFormat(
                                                        "en-US",
                                                        {
                                                            style: "currency",
                                                            currency: "USD",
                                                        }
                                                    ).format(
                                                        trans.purchasePrice
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardInfo;
