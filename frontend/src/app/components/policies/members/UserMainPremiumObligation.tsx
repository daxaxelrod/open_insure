import { Badge, Col, Row, Statistic, Typography } from "antd";
import moment from "moment-timezone";
import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../../redux/hooks";
import {
    PodMembership,
    Policy,
    Premium,
} from "../../../../redux/reducers/types/commonTypes";
import colors from "../../../constants/colors";
import { ConditionalWrapper } from "../../../utils/componentUtils";

const { Title, Paragraph } = Typography;

export default function UserMainPremiumObligation({
    policy,
}: {
    policy: Policy;
}) {
    const focusedRisk = useAppSelector((state) => state.risk.focusedRisk);
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const policyPremiums: Premium[] = useAppSelector(
        (state) => state.premiums.premiums?.[policy.id]
    );
    const userPremiums =
        policyPremiums?.filter((p) => p.payer === currentUser.id) || [];

    const totalPremiumsPaidToPolicy: number = userPremiums
        .filter((p) => p.paid)
        .reduce((accumulator, value) => {
            return accumulator + value.amount;
        }, 0);

    let userMembership = policy?.pod?.memberships?.find(
        (membership: PodMembership) => {
            return membership.user === currentUser.id;
        }
    );

    let nextPaymentDue;
    let isNextPaymentLate = false;
    let now = moment();
    let joinDate = moment(userMembership?.joined_at);
    const unpaidPremiums = userPremiums.filter(
        (p) => !p.paid && moment(p.due_date).isAfter(joinDate)
    );
    if (unpaidPremiums.length > 0) {
        nextPaymentDue = moment(unpaidPremiums[0].due_date);
        if (now.isAfter(nextPaymentDue)) {
            isNextPaymentLate = true;
        }
    }
    const userPremiumObligation = focusedRisk?.premium_amount;

    return (
        <Container>
            <ConditionalWrapper
                condition={
                    userPremiums.length > 0 && unpaidPremiums.length === 0
                }
                wrapper={(children: any) => (
                    <Badge.Ribbon text="Paid in full!">{children}</Badge.Ribbon>
                )}
            >
                <Row style={{ flex: 1 }}>
                    <Col>
                        <Title level={4}>Your Premium</Title>
                        <Title style={{ marginTop: 0 }}>
                            ${(userPremiumObligation / 100).toFixed(2)}
                        </Title>
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Col span={14}>
                        <Statistic
                            title="Total premiums you've paid"
                            value={(totalPremiumsPaidToPolicy / 100).toFixed(2)}
                            formatter={(val) => `$${val}`}
                            valueStyle={{
                                fontSize: "1.2rem",
                            }}
                        />
                    </Col>
                    <Col span={10}>
                        {nextPaymentDue && (
                            <div>
                                <Statistic
                                    title="Next Payment Due"
                                    value={nextPaymentDue.format("M/D/YY")}
                                    valueStyle={{
                                        fontSize: "1.2rem",
                                    }}
                                />
                                {isNextPaymentLate ? (
                                    <Paragraph
                                        style={{
                                            fontSize: ".8rem",
                                            color: colors.alert1,
                                        }}
                                    >
                                        Your payment is late!
                                    </Paragraph>
                                ) : (
                                    <Paragraph style={{ fontSize: ".8rem" }}>
                                        {nextPaymentDue.fromNow()}
                                    </Paragraph>
                                )}
                            </div>
                        )}
                    </Col>
                </Row>
            </ConditionalWrapper>
        </Container>
    );
}

const Container = styled.div({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
});
