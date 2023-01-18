import React from "react";
import { Col, Row, Tabs, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import InvitesList from "../members/InvitesList";

const { Title } = Typography;

export default function PolicyMembershipSettings({
    policy,
}: {
    policy: Policy;
}) {
    return (
        <div>
            <Title level={5}>Membership</Title>
            <Tabs>
                <Tabs.TabPane tab="invites" key="1">
                    <InvitesList policy={policy} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}
