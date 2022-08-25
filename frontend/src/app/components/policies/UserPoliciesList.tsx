import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Policy } from "../../../redux/reducers/commonTypes";
import { getCoverageTypeHumanReadable } from "../../utils/policyUtils";
import ClaimsStatusInlineDisplay from "./claims/ClaimsStatusInlineDisplay";
import SummaryPolicyMembersDisplay from "./members/SummaryPolicyMembersDisplay";
import EscrowPoolAddressInlineDisplay from "./premiums/EscrowPoolAddressInlineDisplay";

export default function UserPoliciesList({ policies }: { policies: Policy[] }) {
    let navigate = useNavigate();

    let currentUser = useAppSelector((state) => state.auth.currentUser);

    const columns: ColumnsType<Policy> = [
        {
            title: "Policy",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Premium",
            dataIndex: "premium_amount",
            key: "premium_amount",
            render(value) {
                return `$${value / 100}`;
            },
        },
        {
            title: "Claims Status",
            key: "claims_status",
            render: (value) => (
                <ClaimsStatusInlineDisplay
                    record={value}
                    currentUser={currentUser}
                />
            ),
        },
        {
            title: "Pool Balance",
            dataIndex: "pool_balance",
            render: (value: number) => {
                return `$${value / 100}`;
            },
            key: "pool_balance",
        },
        {
            title: "Pool Address",
            dataIndex: "pool_address",
            key: "pool_address",
            render: (value: string) => (
                <EscrowPoolAddressInlineDisplay address={value} />
            ),
        },
        {
            title: "Coverage Type",
            dataIndex: "coverage_type",
            render: (coverage_type: string) => {
                return getCoverageTypeHumanReadable(coverage_type);
            },
            key: "coverage_type",
        },

        {
            title: "Members",
            render: (value, record) => {
                return (
                    <SummaryPolicyMembersDisplay policy={record} includeCount />
                );
            },
            key: "pod_members",
        },
    ];

    return (
        <Table
            style={{ marginRight: "1rem" }}
            rowClassName="cursor-pointer"
            dataSource={policies}
            columns={columns}
            rowKey="id"
            onRow={(record) => {
                return {
                    onClick: (event) => navigate(`/policy/${record.id}`),
                };
            }}
        />
    );
}
