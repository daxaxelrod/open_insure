import { SummaryStats } from "../../../../../redux/reducers/types/actuaryTypes";

// https://github.com/sgratzl/chartjs-chart-boxplot

export default function LossRateBoxAndWiskersChart({
    data,
}: {
    data: SummaryStats;
}) {
    const chartData = {
        labels: ["Dataset"],
        datasets: [
            {
                label: "Dataset",
                data: [
                    data.minimum_value,
                    data["25th_percentile"],
                    data.median,
                    data["75th_percentile"],
                    data.maximum_value,
                ],
                backgroundColor: "rgba(75,192,192,1)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Box and Whiskers Chart",
            },
        },
    };

    return <div>boxplot</div>;
}
