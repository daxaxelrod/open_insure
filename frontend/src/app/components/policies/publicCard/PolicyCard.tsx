import React, { useEffect, useState } from "react";
import { Card, Col, Dropdown, Grid, Menu, Row } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { Link } from "react-router-dom";
import Title from "./Title";
import PolicyIcon from "./PolicyIcon";
import LowestPremiumDisplay from "./LowestPremiumDisplay";
import CoverageRow from "./CoverageRow";
import { useAppSelector } from "../../../../redux/hooks";
import { determineLowestPremium } from "../utils/riskUtils";

export default function PolicyCard({ policy }: { policy: Policy }) {
    const screens = Grid.useBreakpoint();
    const policyRisks = useAppSelector(
        (state) => state.risk.policyRisks?.[policy.id]
    );
    const risksPending = useAppSelector((state) => state.risk.getRisksPending);
    let lowestPremiumInPolicy = determineLowestPremium(policyRisks);

    const isMobile = screens.xs || (screens.sm && !screens.md);
    const isMed = screens.md && !screens.lg;

    return (
        <Col
            lg={{ span: 8 }}
            md={{ span: 12 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
        >
            <div
                style={{
                    paddingTop: isMobile ? 20 : 10,
                    paddingBottom: isMobile ? 0 : 10,
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
