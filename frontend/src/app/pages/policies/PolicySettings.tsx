import React, { useEffect } from "react";
import { Col, Divider, Row, Typography } from "antd";

import PolicyUnderwritingSettings from "../../components/policies/settings/PolicyUnderwritingSettings";
import PolicyExtensionSettings from "../../components/policies/settings/PolicyExtensionSettings";
import PolicyMemebershipSettings from "../../components/policies/settings/PolicyMembershipSettings";
import { Policy, RiskSettings } from "../../../redux/reducers/commonTypes";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useParams } from "react-router-dom";
import PolicyDangerZone from "../../components/policies/settings/PolicyDangerZone";
import { getPolicyRiskSettings } from "../../../redux/actions/policies";

const { Title } = Typography;

export default function PolicySettings() {
    let { id } = useParams();
    const dispatch = useAppDispatch();

    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );

    const riskSettings: RiskSettings = useAppSelector(
        (state) => state.risk.policyRiskSettings?.[policy?.id]
    );

    useEffect(() => {
        if (riskSettings === undefined) {
            dispatch(getPolicyRiskSettings(policy?.id));
        }
    }, [policy?.id]);

    if (!policy || !riskSettings) {
        return <div>Policy Not Found</div>;
    }

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
