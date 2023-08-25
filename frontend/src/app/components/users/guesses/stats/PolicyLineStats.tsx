import React from "react";
import { Typography, Card, Row, Col } from "antd";
import { useAppSelector } from "../../../../../redux/hooks";
import GlassOverlay from "../../../common/GlassOverlay";
import { PolicyLineStats } from "../../../../../redux/reducers/types/actuaryTypes";
const { Title, Paragraph } = Typography;

export default function PolicyLineStats({
    isOnSecondStep,
}: {
    isOnSecondStep: boolean;
}) {
    // const { guess } = useAppSelector((state) => state.actuary.guess);

    const activeGuess = useAppSelector(
        (state) => state.actuary.activePropertyLifeDatePoint
    );
    const stats: PolicyLineStats = useAppSelector(
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

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    zIndex: 1,
                }}
            >
                <SignifiganceThermometer
                    count={stats.actuary_details.count}
                    requiredCount={stats.actuary_details.count * 2 || 10}
                />
                <Row>
                    <Col span={12}>
                        <PolicyStatsHeadlineNumbers stats={stats} />
                    </Col>
                    <Col span={12}>
                        <LossByCountByAgeInteractiveChart
                            data={
                                stats.actuary_details
                                    .loss_cost_by_loss_count_by_avg_age
                            }
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <LossRateBoxAndWiskersChart
                            data={stats.actuary_details.loss_rate_summary}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
}
