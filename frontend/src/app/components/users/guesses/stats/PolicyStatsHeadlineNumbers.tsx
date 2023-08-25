import React from "react";
import { ActuaryDetails } from "../../../../../redux/reducers/types/actuaryTypes";
import CountUp from "react-countup";
import { Col, Row, Statistic } from "antd";
import { FormatConfig, valueType } from "antd/es/statistic/utils";

const formatter = (value: valueType, config?: FormatConfig) => (
    <CountUp
        end={value as number}
        separator=","
        decimals={(value as number) % 1 !== 0 ? 2 : 0}
    />
);

export default function PolicyStatsHeadlineNumbers({
    data,
}: {
    data: ActuaryDetails;
}) {
    return (
        <>
            <Row gutter={16}>
                <Col span={24}>
                    <Statistic
                        title="Total Contributions"
                        value={data.count}
                        formatter={formatter}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Statistic
                        title="Total Asset value"
                        value={data.total_asset_value}
                        precision={2}
                        prefix="$"
                        formatter={formatter}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Average Loss Ratio"
                        value={data.loss_rate_summary.mean / 100}
                        precision={4}
                        suffix="%"
                        formatter={formatter}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Loss Cost"
                        value={data.loss_rate_summary.sum}
                        precision={4}
                        suffix="%"
                        formatter={formatter}
                    />
                </Col>
            </Row>
        </>
    );
}
