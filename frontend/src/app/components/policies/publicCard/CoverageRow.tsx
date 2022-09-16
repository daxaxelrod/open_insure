import { Col, Row, Typography } from "antd";
import moment from "moment-timezone";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { dateFormat } from "../../../constants/moment";
import { grey } from "@ant-design/colors";
import colors from "../../../constants/colors";
import { isPolicyMember } from "../../../utils/policyUtils";
import { useAppSelector } from "../../../../redux/hooks";

const { Paragraph, Title } = Typography;

export default function CoverageRow({ policy }: { policy: Policy }) {
    let hasStartDate = !!policy.coverage_start_date;
    let hasPolicyStarted = moment().isAfter(moment(policy.coverage_start_date));
    let currentUser = useAppSelector((state) => state.auth.currentUser);
    let isMember = isPolicyMember(currentUser, policy);

    return (
        <Row justify="space-between" style={{ flex: 1 }}>
            <Col>
                <p style={{ color: "F5F5F5", fontSize: 10, marginBottom: 0 }}>
                    Starts:
                </p>
                <Title style={{ marginBottom: 0, marginLeft: 4 }} level={5}>
                    {hasStartDate
                        ? moment(policy.coverage_start_date).format(dateFormat)
                        : "Undecided"}
                </Title>
                <Paragraph style={{ color: grey.primary, marginLeft: 4 }}>
                    Duration: {policy.coverage_duration} months
                </Paragraph>
            </Col>
            <Col
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                }}
            >
                <Paragraph style={{ fontSize: ".75rem" }}>
                    {hasPolicyStarted ? "Started" : "In setup mode"}
                </Paragraph>
                {isMember && (
                    <Paragraph
                        style={{
                            fontSize: ".75rem",
                            padding: "2px 4px",
                            borderRadius: 8,
                            background: colors.lightGood,
                        }}
                    >
                        Member
                    </Paragraph>
                )}
            </Col>
        </Row>
    );
}
