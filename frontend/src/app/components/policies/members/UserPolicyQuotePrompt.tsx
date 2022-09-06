import React, { useEffect, useState } from "react";
import { Button, Col, Row, Skeleton, Typography } from "antd";
import { useParams } from "react-router-dom";
import { getQuote } from "../../../../redux/actions/risk";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { Policy } from "../../../../redux/reducers/commonTypes";

const { Title, Paragraph } = Typography;

export default function UserPolicyQuotePrompt({
    openRiskDrawer,
}: {
    openRiskDrawer: () => void;
}) {
    let { id } = useParams();
    const dispatch = useAppDispatch();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    const risk = useAppSelector((state) => state.risk.focusedRisk);
    const riskPending = useAppSelector((state) => state.risk.modifyRiskPending);
    const getQuotePending = useAppSelector(
        (state) => state.risk.getQuotePending
    );

    const [retrievedQuote, setRetrievedQuote] = useState(false);

    useEffect(() => {
        // should this rely on risk?
        if (risk && risk?.id && policy?.id && !retrievedQuote) {
            dispatch(getQuote(policy.id, risk.id));
            setRetrievedQuote(true);
        }
    }, [riskPending, risk, policy, retrievedQuote]);

    if (getQuotePending) {
        return <Skeleton />;
    }

    // prompt to fill out their information and get a quote
    // needs more love

    return (
        <div style={{ flex: 1 }}>
            <Title level={4}>Get a quote</Title>
            <Row align="middle" justify="space-between">
                <Col span={12}>
                    <span>starting at</span>
                    <Title style={{ marginTop: 0 }} level={5}>
                        {risk?.premium_amount
                            ? `${risk?.premium_amount / 100} / month`
                            : "- / month"}
                    </Title>
                </Col>
                <Col span={12}>
                    <Button
                        onClick={openRiskDrawer}
                        type={"primary"}
                        size={"large"}
                    >
                        <Paragraph style={{ color: "white" }}>
                            Get a quote
                        </Paragraph>
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
