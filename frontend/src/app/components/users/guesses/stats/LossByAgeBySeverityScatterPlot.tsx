// @ts-nocheck
import React from "react";
import { LossCostByAge } from "../../../../../redux/reducers/types/actuaryTypes";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LossByAgeBySeverityScatterPlot({
    data,
}: {
    data: LossCostByAge[];
}) {
    const dataPointCounts: { [key: string]: number } = {};
    data.forEach((item) => {
        const key = `${item.average_age_of_loss}_${item.total_value_lost}`;
        dataPointCounts[key] = (dataPointCounts[key] || 0) + 1;
    });

    console.log("dataPointCounts", dataPointCounts);

    const scatterData = {
        datasets: [
            {
                label: "Repair/Replacement Cost by Age ",
                data: data.map((item) => ({
                    x: item.average_age_of_loss,
                    y: item.total_value_lost,
                })),
                pointRadius: data.map((item) =>
                    Math.max(
                        dataPointCounts[
                            `${item.average_age_of_loss}_${item.total_value_lost}`
                        ] * 2,
                        5
                    )
                ),
                pointHoverRadius: 10,
                backgroundColor: "rgba(75, 192, 192, 0.6)", // Adjust the color as needed
            },
        ],
    };

    const scatterOptions = {
        scales: {
            x: {
                type: "linear",
                position: "bottom",
                title: {
                    display: true,
                    text: "Average Age of Loss in Days",
                },
            },
            y: {
                type: "linear",
                position: "left",
                title: {
                    display: true,
                    text: "Total Value Lost",
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    title: (context: any) => {
                        const dataPoint =
                            context?.[0]?.dataset?.data[context[0].dataIndex];

                        if (!dataPoint) return "";
                        return `Age: ${dataPoint.x} days, Value Lost: $${
                            dataPoint.y
                        }, Occurrences: ${
                            dataPointCounts[`${dataPoint.x}_${dataPoint.y}`] ||
                            1
                        }`;
                    },
                    label: (context: any) => {
                        return "";
                    },
                },
            },
        },
    };

    return (
        <div style={{ padding: "1rem" }}>
            <Scatter data={scatterData} options={scatterOptions} />
        </div>
    );
}
