import React, { useContext } from "react";
import { PublicProfileContext } from "../../../contexts/PublicProfileContext";
import { Card, Typography } from "antd";

const { Paragraph } = Typography;

export default function UserPublicPolicyMembershipsCard() {
    const { user } = useContext(PublicProfileContext);

    return (
        <Card title="Policy Memberships" bordered={false}>
            <Paragraph>Policies for User id {user?.id}</Paragraph>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </Card>
    );
}
