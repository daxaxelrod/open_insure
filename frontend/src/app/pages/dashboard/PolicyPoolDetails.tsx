import React, { useEffect } from "react";
import { Alert, Card, Col, Row, Table, Typography } from "antd";

import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getPolicyPremiums } from "../../../redux/actions/premiums";
import { Premium } from "../../../redux/reducers/commonTypes";
import moment from "moment-timezone";
import EscrowPoolChart from "../../components/policies/escrow/EscrowPoolChart";

const { Title: AntTitle } = Typography;

export default function PolicyPoolDetails() {
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
                    <EscrowPoolChart />
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
