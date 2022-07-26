import { Card, Col, Row, Typography } from "antd";
import moment from "moment-timezone";
import React from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { Policy } from "../../../../redux/reducers/commonTypes";
import CoverageRow from "../publicCard/CoverageRow";

const { Paragraph, Title } = Typography;

export default function PolicyQuickViewCard({ policy }: { policy: Policy }) {
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    let isCoverageActive = policy?.coverage_start_date;
    let isCurrentOnPremiums = policy.premiums
        .filter(
            (p) =>
                p.payer === currentUser && moment(p.due_date).isBefore(moment())
        )
        .every((p) => p.paid);

    return (
        <Card
            hoverable
            bordered={true}
            style={{ minWidth: 250, borderWidth: 3, borderRadius: 15 }}
        >
            <Row>
                <Col span={18}>
                    <Row>
                        <Title level={3}>{policy.name}</Title>
                    </Row>
                    <Row>{policy.coverage_type}</Row>
                    <>
                        <Paragraph>
                            Escrow address: {policy.pool_address}
                        </Paragraph>
                        <Paragraph>
                            Escrow Balance: {policy.pool_balance}
                        </Paragraph>
                    </>

                    <Row>
                        <CoverageRow policy={policy} />
                    </Row>
                </Col>
                <Col span={6}>
                    <Paragraph>
                        Coverage: {isCoverageActive ? "Active" : "Inactive"}
                    </Paragraph>
                    <Paragraph>
                        Premiums: {isCurrentOnPremiums ? "Current" : "Past due"}
                    </Paragraph>
                </Col>
            </Row>
        </Card>
    );
}
