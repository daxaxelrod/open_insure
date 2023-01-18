import React from "react";
import { Col, Divider, Row, Typography } from "antd";

import PolicyUnderwritingSettings from "../../components/policies/settings/PolicyUnderwritingSettings";
import PolicyExtensionSettings from "../../components/policies/settings/PolicyExtensionSettings";
import PolicyMemebershipSettings from "../../components/policies/settings/PolicyMembershipSettings";
import { Policy } from "../../../redux/reducers/commonTypes";
import { useAppSelector } from "../../../redux/hooks";
import { useParams } from "react-router-dom";
import PolicyDangerZone from "../../components/policies/settings/PolicyDangerZone";

const { Title } = Typography;

export default function PolicySettings() {
    let { id } = useParams();

    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );

    return (
        <div>
            <Title level={3}>Policy Settings</Title>
            <PolicyUnderwritingSettings policy={policy} />
            <Divider />
            <PolicyExtensionSettings policy={policy} />
            <Divider />
            <PolicyMemebershipSettings policy={policy} />
            <Divider />
            <PolicyDangerZone policy={policy} />
        </div>
    );
}
