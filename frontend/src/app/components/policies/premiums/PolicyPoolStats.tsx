import React from "react";
import { Col, Row, Skeleton, Statistic } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import {
    getGovernanceTypeHumanReadable,
    getPremiumsPaidThisMonth,
} from "../../../utils/policyUtils";
import { useAppSelector } from "../../../../redux/hooks";

export default function PolicyPoolStats({ policy }: { policy: Policy }) {
    const premiums = useAppSelector(
        (state) => state.premiums.premiums?.[policy?.id]
    );
    const premiumsPerMonth = getPremiumsPaidThisMonth(premiums, policy).toFixed(
        2
    );
    const claimsThisMonth = 0;

    return policy && Object.keys(policy).length > 0 ? (
        <Row gutter={16}>
            <Col span={12}>
                <Statistic
                    title="Escrow Balance"
                    value={policy?.pool_balance / 100}
                    formatter={(val) => `$${val}`}
                />
            </Col>
            <Col span={12}>
                <Statistic
                    title="Voting Style"
                    value={getGovernanceTypeHumanReadable(
                        policy?.governance_type
                    )}
                    valueStyle={{ fontSize: "1.2rem" }}
                />
            </Col>
            <Col span={12}>
                <Statistic
                    title="Premiums this month"
                    value={premiumsPerMonth}
                    formatter={(val) => `+$${val}`}
                />
            </Col>
            <Col span={12}>
                <Statistic
                    title="Claims this month"
                    value={claimsThisMonth}
                    formatter={(val) => `-$${val}`}
                />
            </Col>
        </Row>
    ) : (
        <Skeleton />
    );
}
