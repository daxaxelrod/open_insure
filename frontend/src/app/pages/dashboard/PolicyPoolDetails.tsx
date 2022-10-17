import React, { useEffect } from "react";
import { Alert, Card, Col, Row, Table, Typography } from "antd";
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
    }, []);

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
            <Alert
                message="This page is under construction"
                type="error"
                style={{ marginBottom: 20 }}
                showIcon
                closable
            />
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
            <Row>
                <AntTitle level={3}>Premiums</AntTitle>
                <Table />
            </Row>
        </>
    );
}
