import React from "react";
import { Row, Col, Spin } from "antd";
import { useAppSelector } from "../../../../../redux/hooks";
import GlassOverlay from "../../../common/GlassOverlay";
import { PolicyLineStats as PolicyLineStatsType } from "../../../../../redux/reducers/types/actuaryTypes";
import SignifiganceThermometer from "./SignifiganceThermometer";
import PolicyStatsHeadlineNumbers from "./PolicyStatsHeadlineNumbers";
import LossByCountByAgeInteractiveChart from "./LossByCountByAgeInteractiveChart";
import LossRateBoxAndWiskersChart from "./LossRateBoxAndWiskersChart";
import ManufacturerHistogram from "./ManufacturerHistogram";

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
                height: "100%",
            }}
        >
            <GlassOverlay
                blur={hasContributed || true ? 0 : isOnSecondStep ? 4 : 9}
            />

            <Spin spinning={getStatsPending}>
                {stats && (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 1,
                            padding: "1rem",
                        }}
                    >
                        <SignifiganceThermometer
                            count={stats.actuary_details.count}
                            requiredCount={
                                stats.actuary_details.count * 2 || 10
                            }
                        />
                        <Row>
                            <Col span={8}>
                                <PolicyStatsHeadlineNumbers
                                    data={stats.actuary_details}
                                />
                            </Col>
                            <Col span={16}>
                                <LossByCountByAgeInteractiveChart
                                    data={
                                        stats.actuary_details
                                            .loss_cost_by_loss_count_by_avg_age
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <LossRateBoxAndWiskersChart
                                    data={
                                        stats.actuary_details.loss_rate_summary
                                    }
                                />
                            </Col>
                            <Col span={8}>
                                <ManufacturerHistogram
                                    data={stats.actuary_details.manufacturers}
                                />
                            </Col>
                        </Row>
                    </div>
                )}
            </Spin>
        </div>
    );
}
