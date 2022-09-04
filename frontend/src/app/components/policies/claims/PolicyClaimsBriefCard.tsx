import { Card, Col, Row, Statistic, Tooltip, Typography } from "antd";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";

const Title = Typography.Title;

export default function PolicyClaimsBriefCard({ policy }: { policy: Policy }) {
    let numPendingClaims = policy.claims.filter(
        (claim) =>
            claim.approvals.length < policy.claim_approval_threshold_percentage
    ).length;
    return (
        <Card
            style={{
                display: "flex",
                flex: 1,
            }}
            bodyStyle={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
            }}
        >
            <Title level={4}>Claims</Title>
            <Row>
                <Col span={12}>
                    <Statistic
                        title="Number of claims"
                        value={policy.claims.length}
                    />
                </Col>
                <Col>
                    <Statistic title="Incidence rate" value={0} suffix="%" />
                </Col>
            </Row>
            <Row style={{ margin: 0 }}>
                <Tooltip
                    placement="bottom"
                    title={
                        "Claims that have been submitted but not voted on yet"
                    }
                >
                    <Statistic
                        title="Pending Claims"
                        value={numPendingClaims}
                        suffix="%"
                    />
                </Tooltip>
            </Row>
        </Card>
    );
}
