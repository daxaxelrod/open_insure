import React, { useEffect, useState } from "react";
import { Button, Col, Row, Skeleton, Typography } from "antd";
import { useParams } from "react-router-dom";
import { getQuote } from "../../../../redux/actions/risk";
import { ToTopOutlined } from "@ant-design/icons";
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
                                : `You'll be the first one to get a quote for the ${policy.name} policy!`}
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
