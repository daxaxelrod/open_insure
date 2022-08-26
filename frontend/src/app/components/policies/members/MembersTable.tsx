import React from "react";
import { Table, Typography } from "antd";

import { Policy, User } from "../../../../redux/reducers/commonTypes";
import { ColumnsType } from "antd/lib/table";
const { Title } = Typography;

interface MemberRowType extends User {
    key: React.Key;
}

export default function MembersTable({ policy }: { policy: Policy }) {
    const memebers: MemberRowType[] = [];
    const columns: ColumnsType<MemberRowType> = [];
    return (
        <>
            <Title level={4}>Policy Members</Title>
            <Table dataSource={memebers} columns={columns} />
        </>
    );
}
