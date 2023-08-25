import React from "react";
import { Policy } from "../../../../redux/reducers/types/commonTypes";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export default function SummaryPolicyMembersDisplay({
    policy,
    includeCount = false,
}: {
    policy: Policy;
    includeCount?: boolean;
}) {
    return (
        <Avatar.Group maxCount={2}>
            {policy?.pod?.members?.map((member) => (
                <Avatar
                    key={member?.id}
                    src={member?.picture}
                    icon={<UserOutlined />}
                />
            ))}
        </Avatar.Group>
    );
}
