import React from "react";
import { Col, Row, Tabs, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import InvitesList from "../members/InvitesList";
import BoxWithTitleLine from "../../common/BoxWithTitleLine";

const { Title } = Typography;

export default function PolicyMembershipSettings({
    policy,
}: {
    policy: Policy;
}) {
    return (
        <BoxWithTitleLine title="Membership Settings" level={4}>
            <Tabs>
                <Tabs.TabPane tab="invites" key="1">
                    <InvitesList policy={policy} />
                </Tabs.TabPane>
            </Tabs>
        </BoxWithTitleLine>
    );
}
