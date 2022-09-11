import { Badge, Col, Row, Statistic, Typography } from "antd";
import moment from "moment-timezone";
import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../../redux/hooks";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { ConditionalWrapper } from "../../../utils/componentUtils";

const { Title, Paragraph } = Typography;

export default function UserMainPremiumObligation({
    policy,
}: {
    policy: Policy;
}) {
    const focusedRisk = useAppSelector((state) => state.risk.focusedRisk);
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const userPremiums = policy.premiums.filter(
        (p) => p.payer === currentUser.id
    );

    const totalPremiumsPaidToPolicy: number = userPremiums
        .filter((p) => p.paid)
        .reduce((accumulator, value) => {
            return accumulator + value.amount;
        }, 0);

    let nextPaymentDue;
    let isNextPaymentLate = false;
    let now = moment();
    const unpaidPremiums = userPremiums.filter((p) => !p.paid);
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
                condition={unpaidPremiums.length === 0}
                wrapper={(children: any) => (
                    <Badge.Ribbon text="Paid in full!">{children}</Badge.Ribbon>
                )}
            >
                <Row style={{ flex: 1 }}>
                    <Col>
                        <Title level={4}>Your Premium</Title>
                        <Title style={{ marginTop: 0 }}>
                            ${userPremiumObligation / 100}
                        </Title>
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Col>
                        <Statistic
                            title="Premiums Paid to Policy"
                            value={totalPremiumsPaidToPolicy / 100}
                            formatter={(val) => `$${val}`}
                            valueStyle={{
                                fontSize: "1.2rem",
                            }}
                        />
                    </Col>
                    <Col>
                        {nextPaymentDue && (
                            <div>
                                <Statistic
                                    title="Next Payment Due"
                                    value={nextPaymentDue.format(
                                        "dddd, MMMM Do YYYY"
                                    )}
                                    valueStyle={{
                                        fontSize: "1.2rem",
                                    }}
                                />
                                {isNextPaymentLate ? (
                                    <Paragraph style={{ fontSize: ".8rem" }}>
                                        Payment is late!
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
