import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Col, Row, Typography } from "antd";
import { Policy, User } from "../../../redux/reducers/commonTypes";

import moment from "moment-timezone";
import colors from "../../constants/colors";
import PolicyQuoteRequestForm, {
    PolicyQuoteRequestBoxRefType,
} from "../../components/policies/quotes/PolicyQuoteRequestBox";
import InviteFriendToPolicy from "../../components/policies/social/InviteFriendToPolicy";
import PolicyDetailSkeleton from "../../components/dashboard/PolicyDetailSkeleton";
import UserPolicyPremiumBox from "../../components/policies/premiums/UserPolicyPremiumBox";
import PolicyDescriptionRow from "../../components/policies/detail/PolicyDescriptionRow";
import RiskTable from "../../components/policies/quotes/RisksTable";
import MembersTable from "../../components/policies/members/MembersTable";
import PolicyClaimsBriefCard from "../../components/policies/claims/PolicyClaimsBriefCard";
import { getOrCreateRisk } from "../../../redux/actions/risk";
import EscrowBalanceCard from "../../components/policies/premiums/EscrowBalanceCard";

const { Title, Paragraph } = Typography;

export default function PolicyDetails() {
    let { id } = useParams();
    let dispatch = useAppDispatch();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    let policyQuoteDrawerFormRef = useRef<PolicyQuoteRequestBoxRefType>(null);
    let currentUser = useAppSelector((state) => state.auth.currentUser);
    let focusedRisk = useAppSelector((state) => state.risk.focusedRisk);

    useEffect(() => {
        if (policy && policy?.id && focusedRisk === null) {
            dispatch(getOrCreateRisk(policy?.id, {}));
        }
    }, [policy, focusedRisk]);

    let doesPolicyHaveStartDate = policy?.coverage_start_date;
    let hasPolicyStarted = false;
    if (doesPolicyHaveStartDate) {
        hasPolicyStarted = moment().isAfter(moment(policy.coverage_start_date));
    }

    if (!policy) {
        return <PolicyDetailSkeleton />;
    }

    let isMember =
        currentUser.id !== undefined &&
        policy?.pod &&
        policy?.pod.members?.some((m: User) => m.id === currentUser.id);

    let memberHasFilledOutRisk =
        currentUser?.id !== undefined && focusedRisk?.premium_amount;

    const PolicyDetailCol = Col;
    return (
        <div>
            <div>
                <Row align="middle">
                    <Col span={21}>
                        <Title style={{ marginBottom: 0 }} level={2}>
                            {policy?.name}
                        </Title>
                        <Paragraph
                            style={{ color: colors.gray10, fontSize: 12 }}
                        >
                            {hasPolicyStarted ? "Active Policy" : "In setup"}
                        </Paragraph>
                    </Col>
                    <Col span={3}>
                        {(!isMember || !memberHasFilledOutRisk) && (
                            <PolicyQuoteRequestForm
                                policy={policy}
                                ref={policyQuoteDrawerFormRef}
                            />
                        )}
                        {isMember && <InviteFriendToPolicy policy={policy} />}
                    </Col>
                </Row>
            </div>
            <Row align="stretch">
                <PolicyDetailCol
                    span={8}
                    style={{
                        paddingRight: 10,
                        display: "flex",
                        alignItems: "stretch",
                        width: "100%",
                    }}
                >
                    <UserPolicyPremiumBox
                        policy={policy}
                        isMember={isMember}
                        memberHasFilledOutRisk={memberHasFilledOutRisk}
                        openRiskDrawer={() => {
                            policyQuoteDrawerFormRef?.current?.open();
                        }}
                    />
                </PolicyDetailCol>
                <PolicyDetailCol
                    span={8}
                    style={{
                        paddingRight: 10,
                        paddingLeft: 10,
                        display: "flex",
                        alignItems: "stretch",
                        width: "100%",
                    }}
                >
                    <PolicyClaimsBriefCard policy={policy} />
                </PolicyDetailCol>

                <PolicyDetailCol
                    span={8}
                    style={{
                        paddingLeft: 10,
                        display: "flex",
                        alignItems: "stretch",
                        width: "100%",
                    }}
                >
                    <EscrowBalanceCard policy={policy} />
                </PolicyDetailCol>
            </Row>
            <PolicyDescriptionRow policy={policy} />

            <RiskTable policy={policy} />
            <MembersTable policy={policy} />
        </div>
    );
}

// const PolicyDetailCol = styled(Col)({
//     padding: 10,
//     display: "flex",
//     alignItems: "stretch",
//     width: "100%",
// });
