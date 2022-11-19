import React from "react";
import { Table, Typography } from "antd";
import { Claim, Policy } from "../../../../redux/reducers/commonTypes";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

interface ClaimRowType extends Claim {
    key: React.Key;
}

export default function UserPoliciesOpenClaimsTable() {
    const userPolicies = useAppSelector((state) => state.policies.userPolicies);
    const allOpenClaims = userPolicies
        .reduce(
            (previousValue: Policy[], policy: Policy) => [
                ...previousValue,
                ...policy.claims,
            ],
            []
        )
        .filter((claim: Claim) => !claim.is_claim_invalid && !claim.paid_on);

    const columns: ColumnsType<ClaimRowType> = [
        {
            title: "Policy",
            render: (text, record) => (
                <Link to={`/policies/${record.policy}`}>{text}</Link>
            ),
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Claimant",
            dataIndex: "claimant",
            render: (text, record) => (
                <Link to={`/policies/${record.policy}/claims/${record.id}`}>
                    {text}
                </Link>
            ),
            key: "claimant",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "address",
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            <Title level={3}>Claims</Title>
            <Table dataSource={allOpenClaims} columns={columns} />
        </div>
    );
}
