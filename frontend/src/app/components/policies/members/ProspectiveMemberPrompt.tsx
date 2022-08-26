import React from "react";
import { Button, Col, Row, Space, Statistic, Typography } from "antd";
import { useAppSelector } from "../../../../redux/hooks";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import { getHumanReadablePaymentFrequencyForPolicy } from "../utils/riskUtils";
const { Title, Paragraph } = Typography;

export default function ProspectiveMemberPrompt({
    policy,
    openRiskDrawer,
}: {
    policy: Policy;
    openRiskDrawer: () => void;
}) {
    const focusedRisk: Risk = useAppSelector((state) => state.risk.focusedRisk);

    const joinPolicy = () => {
        console.log("join policy", policy.id);
    };

    return (
        <div>
            <Row justify="space-between" align="middle">
                <Col>
                    <Statistic
                        title="Your payment would be"
                        value={focusedRisk.premium_amount / 100}
                        formatter={(val) => `$${val}`}
                    />
                </Col>
            </Row>
            <Paragraph>
                Due {getHumanReadablePaymentFrequencyForPolicy(policy)}
            </Paragraph>
            <Paragraph>
                You've done the hard part of getting a quote. You can now decide
                if you'd like to join or not.
            </Paragraph>
            <Row justify="end" align="middle">
                <Col>
                    <Space size={16}>
                        <Button
                            onClick={openRiskDrawer}
                            type={"dashed"}
                            size={"large"}
                        >
                            <Paragraph>Modify Covered asset</Paragraph>
                        </Button>
                        <Button
                            onClick={joinPolicy}
                            type="primary"
                            size={"large"}
                        >
                            Join Policy
                        </Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
