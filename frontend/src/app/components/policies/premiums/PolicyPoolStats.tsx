import React from "react";
import { Col, Row, Statistic } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import {
    getGovernanceTypeHumanReadable,
    getPremiumsPerMonth,
} from "../../../utils/policyUtils";

export default function PolicyPoolStats({ policy }: { policy: Policy }) {
    const premiumsPerMonth = getPremiumsPerMonth(policy);
    return (
        <Row gutter={16}>
            <Col span={12}>
                <Statistic
                    title="Escrow Balance"
                    value={policy.pool_balance}
                    formatter={(val) => `$${val}`}
                />
            </Col>
            <Col span={12}>
                <Statistic
                    title="Voting Style"
                    value={getGovernanceTypeHumanReadable(
                        policy.governance_type
                    )}
                    valueStyle={{ fontSize: "1.2rem" }}
                />
            </Col>
            <Col span={12}>
                <Statistic
                    title="Premiums per month"
                    value={premiumsPerMonth}
                />
            </Col>
        </Row>
    );
}
