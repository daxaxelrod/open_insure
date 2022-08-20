import React, { useEffect, useState } from "react";
import { Card, Col, Dropdown, Menu, Row } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { Link } from "react-router-dom";
import Title from "./Title";
import PolicyIcon from "./PolicyIcon";
import LowestPremiumDisplay from "./LowestPremiumDisplay";
import CoverageRow from "./CoverageRow";
import { useAppSelector } from "../../../../redux/hooks";
import { determineLowestPremium } from "../utils/riskUtils";

export default function PolicyCard({ policy }: { policy: Policy }) {
    const policyRisks = useAppSelector(
        (state) => state.risk.policyRisks?.[policy.id]
    );
    const risksPending = useAppSelector((state) => state.risk.getRisksPending);
    let lowestPremiumInPolicy = determineLowestPremium(policyRisks);

    return (
        <Col span={8}>
            <div
                style={{
                    padding: 20,
                }}
            >
                <Link to={`/policy/${policy.id}`}>
                    <Card
                        title={<Title policy={policy} />}
                        hoverable
                        bordered={true}
                        style={{
                            minWidth: 250,
                            borderWidth: 3,
                            borderRadius: 15,
                            paddingBottom: 0,
                        }}
                        bodyStyle={{
                            padding: "24px 24px 12px 24px",
                        }}
                    >
                        <Row>
                            <Col span={6}>
                                <PolicyIcon type={policy.coverage_type} />
                            </Col>
                            <Col span={18}>
                                <LowestPremiumDisplay
                                    amount={lowestPremiumInPolicy}
                                    frequency={policy.premium_payment_frequency}
                                    risksPending={risksPending}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <CoverageRow policy={policy} />
                        </Row>
                    </Card>
                </Link>
            </div>
        </Col>
    );
}
