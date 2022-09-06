import React from "react";
import { Avatar, Table, Typography } from "antd";

import { Policy, Risk, User } from "../../../../redux/reducers/commonTypes";
import { ColumnsType } from "antd/lib/table";
import { useAppSelector } from "../../../../redux/hooks";
import { Link } from "react-router-dom";
const { Title } = Typography;

interface MemberRowType extends User {
    key: React.Key;
}

export default function MembersTable({ policy }: { policy: Policy }) {
    const policyRisks = useAppSelector(
        (state) => state.risk.policyRisks?.[policy.id]
    );

    const memebers: MemberRowType[] = policy.pod.members.map((m) => ({
        ...m,
        key: m.id,
    }));

    const columns: ColumnsType<MemberRowType> = [
        {
            title: "Name",
            width: "15rem",
            render: (text, record: MemberRowType) => (
                <Link to={`/members/${record.id}`}>
                    {record.picture && (
                        <Avatar
                            src={record.picture}
                            size={"default"}
                            style={{ marginRight: 6 }}
                        />
                    )}
                    <span>
                        {record.first_name} {record.last_name}
                    </span>
                </Link>
            ),
        },
        {
            title: "Email",

            render: (text, record) => record.email,
        },
    ];
    return (
        <>
            <Title level={4}>Policy Members</Title>
            <Table dataSource={memebers} columns={columns} />
        </>
    );
}
