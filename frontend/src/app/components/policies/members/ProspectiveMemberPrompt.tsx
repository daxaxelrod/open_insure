import React from "react";
import { Button, Col, Row, Statistic, Typography } from "antd";
import { useAppSelector } from "../../../../redux/hooks";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import { getHumanReadablePaymentFrequencyForPolicy } from "../utils/riskUtils";
const { Title, Paragraph } = Typography;

export default function ProspectiveMemberPrompt({
    policy,
}: {
    policy: Policy;
}) {
    const focusedRisk: Risk = useAppSelector((state) => state.risk.focusedRisk);

    return (
        <div>
            <Row>
                <Col>
                    <Statistic
                        title="Your payment would be"
                        value={focusedRisk.premium_amount / 100}
                        formatter={(val) => `$${val}`}
                    />
                </Col>
                <Button onClick={joinPolicy}>Join Policy</Button>
            </Row>
            <Paragraph>
                Due {getHumanReadablePaymentFrequencyForPolicy(policy)}
            </Paragraph>
            <Paragraph>
                You've done the hard part of getting a quote. You can now decide
                if you'd like to join or not.
            </Paragraph>
        </div>
    );
}
