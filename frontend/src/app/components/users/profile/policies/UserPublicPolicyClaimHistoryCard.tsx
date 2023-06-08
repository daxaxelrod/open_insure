import React, { useContext } from "react";
import { PublicProfileContext } from "../../../contexts/PublicProfileContext";
import { Button, Card, Empty, Table, Typography } from "antd";
import { Claim } from "../../../../../redux/reducers/commonTypes";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

interface ClaimRowType extends Partial<Claim> {
    key: React.Key;
}

export default function UserPublicPolicyClaimHistoryCard() {
    const { claims, user } = useContext(PublicProfileContext);

    const tableSource: ClaimRowType[] | undefined = claims?.map(
        (claim: Claim) => {
            return {
                key: claim.id,
                title: claim.title,
                occurance_date: claim.occurance_date,
                amount: claim.amount,
                approved: claim.is_approved,
                paid_on: claim.paid_on,
            };
        }
    );

    const tableColumns: ColumnsType<ClaimRowType> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Date",
            dataIndex: "occurance_date",
            key: "occurance_date",
            render: (date: Date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `$${amount}`,
        },
        {
            title: "Approved",
            dataIndex: "approved",
            key: "approved",
        },
        {
            title: "Paid On",
            dataIndex: "paid_on",
            key: "paid_on",
        },
    ];

    return (
        <Card bordered={true} style={{ marginTop: 10, marginBottom: 10 }}>
            <Title level={4}>Claims</Title>
            <Table
                columns={tableColumns}
                dataSource={tableSource}
                pagination={{ position: [] }}
                locale={{
                    emptyText: (
                        <span>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span>
                                        {user?.first_name} has not made any
                                        claims.
                                    </span>
                                }
                            />
                        </span>
                    ),
                }}
            />
        </Card>
    );
}
