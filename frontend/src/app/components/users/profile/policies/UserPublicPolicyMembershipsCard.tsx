import React, { useContext } from "react";
import { PublicProfileContext } from "../../../contexts/PublicProfileContext";
import { Badge, Card, Table, Typography } from "antd";
import { Policy } from "../../../../../redux/reducers/commonTypes";
import type { ColumnsType } from "antd/es/table";

const { Paragraph } = Typography;

interface PolicyRowType {
    key: React.Key;
    name: string;
    mutual?: boolean;
    coverage_duration: number;
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
            };
        }
    );

    console.log("policies", policies);

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
    ];

    const anyMutual = policies?.some((policy: Policy) => policy.mutual);
    if (anyMutual) {
        tableColumns.push({
            title: "",
            dataIndex: "mutual",
            key: "mutual",
            render: (_, { mutual }) => (
                <>
                    {mutual && Math.random() > 0.2 ? (
                        <Badge.Ribbon text="Both in policy">
                            <div style={{ width: "100%", height: "30px" }} />
                        </Badge.Ribbon>
                    ) : null}
                </>
            ),
        });
    }

    return (
        <Card title="Policy Memberships" bordered={false}>
            <Table columns={tableColumns} dataSource={tableSource} />
        </Card>
    );
}
