import React from "react";
import { Row, Col, Spin, Space, Card, Empty, Button } from "antd";
import { useAppSelector } from "../../../../../redux/hooks";
import GlassOverlay from "../../../common/GlassOverlay";
import { PolicyLineStats as PolicyLineStatsType } from "../../../../../redux/reducers/types/actuaryTypes";
import SignifiganceThermometer from "./SignifiganceThermometer";
import PolicyStatsHeadlineNumbers from "./PolicyStatsHeadlineNumbers";
import ManufacturerHistogram from "./ManufacturerHistogram";
import LossByAgeBySeverityScatterPlot from "./LossByAgeBySeverityScatterPlot";
import PolicyLineLeader from "./PolicyLineLeader";

export default function PolicyLineStats({
    isOnSecondStep,
}: {
    isOnSecondStep: boolean;
}) {
    // const { guess } = useAppSelector((state) => state.actuary.guess);

    const activeGuess = useAppSelector(
        (state) => state.actuary.activePropertyLifeDatePoint
    );
    const stats: PolicyLineStatsType = useAppSelector(
        (state) => state.actuary.activePolicyLineStats
    );
    const getStatsPending = useAppSelector(
        (state) => state.actuary.getPolicyLineStatsPending
    );

    const hasContributed = !!activeGuess;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <GlassOverlay
                blur={hasContributed || !stats ? 0 : isOnSecondStep ? 4 : 9}
            />

            <Spin spinning={getStatsPending}>
                {stats ? (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "white",

                            zIndex: 1,
                            padding: "1.5rem 2.5rem",
                        }}
                    >
                        <Space direction="vertical" size="large">
                            <SignifiganceThermometer
                                count={stats.actuary_details.count}
                                requiredCount={
                                    stats.actuary_details.loss_rate_summary
                                        .required_count_for_desired_confidence ||
                                    10
                                }
                            />
                            <PolicyLineLeader
                                policyLine={stats}
                                count={stats.actuary_details.count}
                                requiredCount={
                                    stats.actuary_details.loss_rate_summary
                                        .required_count_for_desired_confidence ||
                                    10
                                }
                            />
                            <Row>
                                <Col span={11}>
                                    <PolicyStatsHeadlineNumbers
                                        data={stats.actuary_details}
                                    />
                                    <ManufacturerHistogram
                                        data={
                                            stats.actuary_details.manufacturers
                                        }
                                    />
                                </Col>
                                <Col span={13}>
                                    <LossByAgeBySeverityScatterPlot
                                        data={
                                            stats.actuary_details
                                                .loss_cost_by_loss_count_by_avg_age
                                        }
                                    />
                                    {/* <LossByCountByAgeInteractiveChart
                                        data={
                                            stats.actuary_details
                                                .loss_cost_by_loss_count_by_avg_age
                                        }
                                    /> */}
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col span={16}>
                                    <LossRateBoxAndWiskersChart
                                        data={
                                            stats.actuary_details
                                                .loss_rate_summary
                                        }
                                    />
                                </Col>
                            </Row> */}
                            {/* <UserContributionBadgesSection /> */}
                        </Space>
                    </div>
                ) : (
                    <Empty
                        style={{
                            marginTop: "3rem",
                        }}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span>Choose a property type to get started</span>
                        }
                    />
                )}
            </Spin>
            <div
                style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                }}
            >
                <Button
                    type="text"
                    target="_blank"
                    href="https://github.com/daxaxelrod/open_insure/tree/master/gatherer/utils.py"
                >
                    Math
                </Button>
            </div>
        </div>
    );
}
