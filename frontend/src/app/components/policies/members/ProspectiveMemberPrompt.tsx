import React, { useState } from "react";
import { Button, Col, Row, Space, Statistic, Typography } from "antd";
import { useAppSelector } from "../../../../redux/hooks";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import { getHumanReadablePaymentFrequencyForPolicy } from "../utils/riskUtils";
import Confetti, { ConfettiConfig } from "react-dom-confetti";
const { Title, Paragraph } = Typography;

export default function ProspectiveMemberPrompt({
    policy,
    openRiskDrawer,
}: {
    policy: Policy;
    openRiskDrawer: () => void;
}) {
    const focusedRisk: Risk = useAppSelector((state) => state.risk.focusedRisk);
    const [isConfettiActive, setIsConfettiActive] = useState(false);

    const joinPolicy = () => {
        console.log("join policy", policy.id);
        setIsConfettiActive(true);
        setTimeout(() => {
            setIsConfettiActive(false);
        }, 500);
    };

    const confettiConfig: ConfettiConfig = {
        angle: 126,
        spread: 160,
        startVelocity: 40,
        elementCount: 62,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
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
                        <Confetti
                            active={isConfettiActive}
                            config={confettiConfig}
                        />
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
