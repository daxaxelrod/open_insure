import React, { useContext } from "react";
import { PublicProfileContext } from "../../../contexts/PublicProfileContext";
import { Badge, Card, Table, Typography } from "antd";
import { Policy } from "../../../../../redux/reducers/commonTypes";
import type { ColumnsType } from "antd/es/table";

const { Paragraph, Title } = Typography;

interface PolicyRowType {
    key: React.Key;
    name: string;
    mutual?: boolean;
    coverage_duration: number;
    premium_monthly_payments_made: number;
    on_time_payments: number;
}

export default function UserPublicPolicyMembershipsCard() {
    const { policies } = useContext(PublicProfileContext);

    const tableSource: PolicyRowType[] | undefined = policies?.map(
        (policy: Policy) => {
            return {
                key: policy.id,
                name: policy.name,
                mutual: policy.mutual,
                coverage_duration: policy.coverage_duration,
                premium_monthly_payments_made: 12, // policy.premium_monthly_payments_made,
                on_time_payments: 100, // policy.on_time_payments,
            };
        }
    );

    const tableColumns: ColumnsType<PolicyRowType> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Coverage Duration",
            dataIndex: "coverage_duration",
            key: "coverage_duration",
        },
        {
            title: "Premiums Paid",
            dataIndex: "premiums_paid",
            key: "premiums_paid",
            render: (
                _,
                { premium_monthly_payments_made, coverage_duration }
            ) => (
                <Paragraph>
                    {premium_monthly_payments_made} / {coverage_duration} (
                    {Math.round(
                        (100 * premium_monthly_payments_made) /
                            coverage_duration
                    )}
                    % paid)
                </Paragraph>
            ),
        },
        {
            title: "On Time Payments",
            dataIndex: "on_time_payments",
            key: "on_time_payments",
            render: (_, { on_time_payments }) => `${on_time_payments}%`,
        },
    ];

    const anyMutual = policies?.some((policy: Policy) => policy.mutual);
    if (anyMutual) {
        tableColumns.push({
            title: "",
            dataIndex: "mutual",
            key: "mutual",
            render: (_, { mutual }) => (
                <>
                    {mutual ? (
                        <Badge.Ribbon text="Both in policy">
                            <div style={{ width: "100%", height: "30px" }} />
                        </Badge.Ribbon>
                    ) : null}
                </>
            ),
        });
    }

    return (
        <Card bordered={true} style={{ marginTop: 10, marginBottom: 10 }}>
            <Title level={4}>Policy Memberships</Title>
            <Table
                columns={tableColumns}
                dataSource={tableSource}
                pagination={{ position: [] }}
            />
        </Card>
    );
}
