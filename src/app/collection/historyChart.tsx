import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    Point,
    PointElement,
    Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useCollectionPriceHistoryQuery } from "./query";

ChartJS.register(
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

const CollectionHistoryChart: React.FC = () => {
    const dataQuery = useCollectionPriceHistoryQuery();

    const [points, setPoints] = useState<Point[] | null>(null);
    const [renderColor, setRenderColor] = useState<string>();

    useEffect(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        const color = rootStyles.getPropertyValue("--color-base-content");
        setRenderColor(color || "black");
    }, []);

    useEffect(() => {
        if (!dataQuery.isSuccess || !dataQuery.data) {
            setPoints(null);
            return;
        }

        const newPoints: Point[] = dataQuery.data.map((datum) => {
            return { x: datum.date.getTime(), y: datum.value };
        });
        newPoints.sort((a, b) => a.x - b.x);
        setPoints(newPoints);
    }, [dataQuery.data]);

    return (
        <React.Fragment>
            {points !== null && (
                <div className="max-h-96 my-3">
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
                                            return new Intl.NumberFormat(
                                                "en-US",
                                                {
                                                    style: "currency",
                                                    currency: "USD",
                                                }
                                            ).format(Number(tickValue));
                                        },
                                    },
                                },
                            },
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        title(tooltipItems) {
                                            return tooltipItems.map(
                                                (tooltipItem) =>
                                                    new Date(
                                                        tooltipItem.parsed.x
                                                    ).toDateString()
                                            );
                                        },
                                        label(tooltipItem) {
                                            return new Intl.NumberFormat(
                                                "en-US",
                                                {
                                                    style: "currency",
                                                    currency: "USD",
                                                }
                                            ).format(tooltipItem.parsed.y);
                                        },
                                    },
                                },
                            },
                        }}
                        data={{
                            datasets: [
                                {
                                    data: points,
                                    borderColor: renderColor,
                                },
                            ],
                        }}
                        className="w-screen"
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export default CollectionHistoryChart;
