import React, { useEffect } from "react";
import { Card, Col, Row, Typography } from "antd";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const { Title: AntTitle } = Typography;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function PolicyPoolDetails() {
    useEffect(() => {
        console.log("get policy escrow pool details");
    });

    const options = {};

    const data = {
        labels: ["May", "June", "July", "Aug", "Sept", "Oct"],
        datasets: [
            {
                id: 1,
                label: "Escrow Balance",
                data: [1, 5, 10, 15, 20, 9],
            },
        ],
    };

    return (
        <>
            <AntTitle level={3}>Escrow Pool</AntTitle>
            <Row gutter={18}>
                <Col span={16}>
                    <Line datasetIdKey="id" data={data} />
                </Col>
                <Col span={7}>
                    <Card style={{ marginBottom: "2rem" }}>
                        Pool Health indicators
                    </Card>
                    <Card>Latest claims info</Card>
                </Col>
            </Row>
        </>
    );
}
