import React, { useEffect, useState } from "react";
import { Button, Col, Row, Skeleton, Typography } from "antd";
import { useParams } from "react-router-dom";
import { getQuote } from "../../../../redux/actions/risk";
import { ToTopOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { Policy, Risk } from "../../../../redux/reducers/commonTypes";

const { Title, Paragraph } = Typography;

const whatEvenDoesItMeanToBeEarlyThreshold = 10;

export default function UserPolicyQuotePrompt({
    openRiskDrawer,
}: {
    openRiskDrawer: () => void;
}) {
    let { id } = useParams();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    let policyRisks: Risk[] = useAppSelector(
        (state) => state.risk.policyRisks?.[parseInt(id || "")]
    );
    const risk = useAppSelector((state) => state.risk.focusedRisk);
    const getQuotePending = useAppSelector(
        (state) => state.risk.getQuotePending
    );

    if (getQuotePending) {
        return <Skeleton />;
    }

    let isEarlyQuoter =
        policyRisks.filter((risk: Risk) => {
            return risk?.premium_amount;
        }).length < whatEvenDoesItMeanToBeEarlyThreshold;

    // prompt to fill out their information and get a quote
    // needs more love

    return (
        <div
            style={{
                flex: 1,
                justifyContent: "space-around",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Title level={4}>Get a quote</Title>
            <Row align="middle" justify="space-between">
                <Col span={18}>
                    <span>
                        <Paragraph style={{ marginTop: 0 }}>
                            {risk?.premium_amount
                                ? `${risk?.premium_amount / 100} / month`
                                : isEarlyQuoter
                                ? `You'll be the first one to get a quote for the ${policy.name} policy!`
                                : `Join this popular policy!`}
                        </Paragraph>
                    </span>
                </Col>
            </Row>
            <Row justify="end">
                <Button
                    onClick={openRiskDrawer}
                    type={"primary"}
                    size={"large"}
                >
                    <Paragraph style={{ color: "white" }}>
                        Get a quote
                    </Paragraph>
                </Button>
            </Row>
        </div>
    );
}
