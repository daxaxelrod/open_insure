import React from "react";
import { Table, Typography } from "antd";
import {
    Claim,
    Policy,
    User,
} from "../../../../redux/reducers/types/commonTypes";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import type { ColumnsType } from "antd/es/table";
import ClaimantShortDisplay from "./detail/ClaimantShortDisplay";

const { Title } = Typography;

interface ClaimRowType extends Claim {
    key: React.Key;
}

export default function UserPoliciesOpenClaimsTable() {
    const userPolicies = useAppSelector((state) => state.policies.userPolicies);
    console.log("userPolicies", userPolicies);

    const allOpenClaims =
        userPolicies
            ?.reduce(
                (previousValue: Policy[], policy: Policy) => [
                    ...previousValue,
                    ...(policy?.claims || []),
                ],
                []
            )
            ?.filter(
                (claim: Claim) => !claim.is_claim_invalid && !claim.paid_on
            ) || [];

    const columns: ColumnsType<ClaimRowType> = [
        {
            title: "Policy",
            render: (text, record) => (
                <Link to={`/policy/${record.policy}/claims/${record.id}`}>
                    {text}
                </Link>
            ),
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Claimant",
            dataIndex: "claimant",
            render: (text, record) => {
                // flatten the array to just be an user[] and then search that for the claimant
                let claimant = userPolicies
                    ?.map((policy: Policy) => {
                        return policy?.pod?.members;
                    })
                    .flat()
                    .find((member: User) => member.id === record.claimant);
                return claimant ? (
                    <ClaimantShortDisplay
                        claimant={claimant}
                        linkToProfile
                        smallTextSize
                    />
                ) : (
                    "Unknown"
                );
            },
            key: "claimant",
        },
        {
            title: "Amount",
            render(value, record, index) {
                return <span>${record.amount / 100}</span>;
            },
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
