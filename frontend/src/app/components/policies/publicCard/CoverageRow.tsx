import { Row, Typography } from "antd";
import moment from "moment-timezone";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { dateFormat } from "../../../constants/moment";
import { grey } from "@ant-design/colors";

const { Paragraph, Title } = Typography;

export default function CoverageRow({ policy }: { policy: Policy }) {
    let hasStartDate = !!policy.coverage_start_date;
    let hasPolicyStarted = moment().isAfter(moment(policy.coverage_start_date));

    return (
        <Row justify="space-between" style={{ flex: 1 }}>
            <div>
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
            </div>
            <div
                style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paragraph>
                    {hasPolicyStarted
                        ? "Coverage already started"
                        : "Coverage Active"}
                </Paragraph>
            </div>
        </Row>
    );
}
