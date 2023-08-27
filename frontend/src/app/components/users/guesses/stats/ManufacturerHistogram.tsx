import React from "react";
import { Manufacturers } from "../../../../../redux/reducers/types/actuaryTypes";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import colors from "../../../../constants/colors";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ManufacturerHistogram({
    data,
}: {
    data: Manufacturers;
}) {
    const chartData = {
        labels: data.bins,
        datasets: [
            {
                label: "Manufacturer Count",
                data: data.counts,
                backgroundColor: colors.lightGood,
                borderColor: colors.gray3,
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Count",
                },
                ticks: {
                    precision: 0,
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Manufacturer",
                },
            },
        },
    };

    return <Bar data={chartData} options={chartOptions} />;
}
