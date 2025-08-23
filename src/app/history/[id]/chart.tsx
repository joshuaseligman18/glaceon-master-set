import { Card } from "@/lib/types/models";
import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    Point,
    PointElement,
    Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

interface Props {
    card: Card;
}

const CardHistoryChart: React.FC<Props> = ({ card }) => {
    const [renderColor, setRenderColor] = useState<string>();
    const [cardGrade, setCardGrade] = useState<string>("market");
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        const color = rootStyles.getPropertyValue("--color-base-content");
        setRenderColor(color || "black");
    }, []);

    const chartData: Point[] = useMemo(() => {
        return card.prices
            .filter(
                (priceObj) =>
                    fromDate === undefined || priceObj.date >= fromDate
            )
            .filter(
                (priceObj) => toDate === undefined || priceObj.date <= toDate
            )
            .map((priceObj) => {
                let price: number | undefined;
                switch (cardGrade) {
                    case "market":
                        price = priceObj.tcgMarketPrice;
                        break;
                    case "10":
                        price = priceObj.priceChartingGrade10Price;
                        break;
                    case "9.5":
                        price = priceObj.priceChartingGrade95Price;
                        break;
                    case "9":
                        price = priceObj.priceChartingGrade9Price;
                        break;
                    case "8":
                        price = priceObj.priceChartingGrade8Price;
                        break;
                    case "7":
                        price = priceObj.priceChartingGrade7Price;
                        break;
                    case "ungraded":
                        price = priceObj.priceChartingUngradedPrice;
                        break;
                }

                return price !== undefined
                    ? {
                          x: priceObj.date.getTime(),
                          y: price,
                      }
                    : null;
            })
            .filter((point) => point !== null);
    }, [card.prices, cardGrade, fromDate, toDate]);

    return (
        <div className="space-y-3">
            <div className="border-1 p-3 flex flex-col items-center justify-evenly w-fit">
                <label className="select select-sm">
                    <span className="label">Card grade</span>
                    <select
                        value={cardGrade}
                        onChange={(e) => setCardGrade(e.target.value)}
                    >
                        <option value="market">Market</option>
                        <option value="10">PSA 10</option>
                        <option value="9.5">PSA 9.5</option>
                        <option value="9">PSA 9</option>
                        <option value="8">PSA 8</option>
                        <option value="7">PSA 7</option>
                        <option value="ungraded">Ungraded</option>
                    </select>
                </label>
                <label className="input input-sm">
                    <span className="label">From date</span>
                    <input
                        type="date"
                        onChange={(e) =>
                            setFromDate(
                                e.target.value
                                    ? new Date(
                                          new Date(e.target.value).getTime() +
                                              new Date(
                                                  e.target.value
                                              ).getTimezoneOffset() *
                                                  60 *
                                                  1000
                                      )
                                    : undefined
                            )
                        }
                    />
                </label>
                <label className="input input-sm">
                    <span className="label">To date</span>
                    <input
                        type="date"
                        onChange={(e) =>
                            setToDate(
                                e.target.value
                                    ? new Date(
                                          new Date(e.target.value).getTime() +
                                              new Date(
                                                  e.target.value
                                              ).getTimezoneOffset() *
                                                  60 *
                                                  1000
                                      )
                                    : undefined
                            )
                        }
                    />
                </label>
            </div>
            <div className="max-h-96">
                <Line
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: "linear",
                                position: "bottom",
                                ticks: {
                                    callback(tickValue, _index, _ticks) {
                                        return new Date(
                                            tickValue
                                        ).toDateString();
                                    },
                                },
                            },
                            y: {
                                type: "linear",
                                position: "left",
                                ticks: {
                                    callback(tickValue, _index, _ticks) {
                                        return new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(Number(tickValue));
                                    },
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title(tooltipItems) {
                                        return tooltipItems.map((tooltipItem) =>
                                            new Date(
                                                tooltipItem.parsed.x
                                            ).toDateString()
                                        );
                                    },
                                    label(tooltipItem) {
                                        return new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(tooltipItem.parsed.y);
                                    },
                                },
                            },
                        },
                    }}
                    data={{
                        datasets: [
                            {
                                data: chartData,
                                borderColor: renderColor,
                            },
                        ],
                    }}
                    className="w-screen"
                />
            </div>
        </div>
    );
};

export default CardHistoryChart;
