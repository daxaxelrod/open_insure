import { Row } from "antd";
import moment from "moment-timezone";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { dateFormat } from "../../../constants/moment";

export default function CoverageRow({ policy }: { policy: Policy }) {
    let hasPolicyStarted = moment().isAfter(moment(policy.coverage_start_date));

    return (
        <Row justify="space-between">
            {moment(policy.coverage_start_date).format(dateFormat)} -{" "}
            {moment(policy.coverage_duration)
                .add(policy.coverage_duration, "months")
                .format(dateFormat)}
            Started? {hasPolicyStarted ? "Yes" : "No"}
        </Row>
    );
}
