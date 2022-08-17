import React, { useEffect, useState } from "react";
import { Button, Col, Row, Skeleton, Typography } from "antd";
import { useParams } from "react-router-dom";
import { getQuote } from "../../../../redux/actions/risk";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { Policy } from "../../../../redux/reducers/commonTypes";

const { Title, Paragraph } = Typography;

export default function UserPolicyQuote() {
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

    const joinPolicy = () => {};

    if (getQuotePending) {
        return <Skeleton />;
    }

    return (
        <div>
            <Row>
                <Col span={12}>
                    <Title style={{ marginTop: 0 }}>
                        ${risk?.premium_amount / 100} / month
                    </Title>
                    <Paragraph style={{ color: "gray" }}>Your quote</Paragraph>
                </Col>
                <Col>
                    <Button onClick={joinPolicy} type={"primary"}>
                        <Paragraph style={{ color: "white" }}>
                            Join Policy
                        </Paragraph>
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
