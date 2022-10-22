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
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getPolicyPremiums } from "../../../redux/actions/premiums";
import { Premium } from "../../../redux/reducers/commonTypes";
import moment from "moment-timezone";

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
    const { id } = useParams();
    const policyId = parseInt(id || "");
    const dispatch = useAppDispatch();
    const premiums = useAppSelector(
        (state) => state.premiums.premiums?.[policyId]
    );
    const getPolicyPremiumsPending = useAppSelector(
        (state) => state.premiums.getPolicyPremiumsPending
    );

    useEffect(() => {
        if (!premiums && !getPolicyPremiumsPending && policyId) {
            dispatch(getPolicyPremiums(policyId));
        }
    }, [premiums, getPolicyPremiumsPending, policyId]);

    const options = {};

    // no padding, earliest to latest premium

    let t: any = {};
    let premiumMonthsArray = premiums.reduce((acc: any[], premium: Premium) => {
        let dueDate = moment(premium.due_date).month();
        if (!(dueDate in acc)) {
            acc.push(dueDate);
        }
        return acc;
    }, []);
    console.log({ premiumMonthsArray });

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
