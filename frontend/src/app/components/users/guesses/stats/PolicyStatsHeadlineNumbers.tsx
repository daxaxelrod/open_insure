import React from "react";
import { ActuaryDetails } from "../../../../../redux/reducers/types/actuaryTypes";
import CountUp from "react-countup";
import { Col, Row, Statistic, Tooltip, Typography, Grid } from "antd";
import { FormatConfig, valueType } from "antd/es/statistic/utils";
import colors from "../../../../constants/colors";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

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
    const grid = Grid.useBreakpoint();
    const isMobile =
        (grid.xs || grid.sm) && !grid.md && !grid.lg && !grid.xl && !grid.xxl;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                width: "100%",
                marginBottom: "0rem",
                flex: 1,
            }}
        >
            <Row
                gutter={16}
                style={{
                    marginBottom: "2rem",
                }}
                wrap
            >
                <Col
                    xs={12}
                    sm={12}
                    md={24}
                    lg={24}
                    xl={24}
                    xxl={24}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: isMobile ? "2rem" : "1rem",
                    }}
                >
                    <Statistic
                        title="Average Loss Rate"
                        value={data.loss_rate_summary.mean / 100}
                        precision={4}
                        suffix="%"
                        valueStyle={{
                            fontSize: "1.75rem",
                        }}
                        formatter={formatter}
                    />
                    <Tooltip
                        color="black"
                        placement="leftTop"
                        title={() => (
                            <div style={{ padding: 10 }}>
                                For every $100 of asset value, the average
                                damage per year costs $
                                {(data.loss_rate_summary.mean / 100).toFixed(2)}
                                .
                            </div>
                        )}
                    >
                        <QuestionCircleOutlined
                            style={{
                                color: colors.gray7,
                                padding: "4px 10px",
                                marginLeft: 0,
                            }}
                        />
                    </Tooltip>
                </Col>

                <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <Statistic
                        title="Total value of submitted assets"
                        value={Math.round(data.total_asset_value)}
                        precision={2}
                        prefix="$"
                        formatter={formatter}
                    />
                </Col>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <Statistic
                        title="Average Asset Value"
                        value={Math.round(data.asset_value_summary.mean)}
                        prefix="$"
                        formatter={formatter}
                    />
                </Col>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <Statistic
                        title="Median Loss Cost"
                        value={Math.round(data.loss_rate_summary.mean)}
                        prefix="$"
                    />
                    <Paragraph type="secondary">
                        Std Dev:{" "}
                        {Math.round(data.loss_rate_summary.standard_deviation)}
                    </Paragraph>
                </Col>
            </Row>
        </div>
    );
}
