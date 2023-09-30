import React, { useState } from "react";
import {
    Row,
    Col,
    Spin,
    Space,
    Grid,
    Empty,
    Button,
    Drawer,
    Modal,
} from "antd";
import { useAppSelector } from "../../../../../redux/hooks";
import GlassOverlay from "../../../common/GlassOverlay";
import { PolicyLineStats as PolicyLineStatsType } from "../../../../../redux/reducers/types/actuaryTypes";
import SignifiganceThermometer from "./SignifiganceThermometer";
import PolicyStatsHeadlineNumbers from "./PolicyStatsHeadlineNumbers";
import ManufacturerHistogram from "./ManufacturerHistogram";
import LossByAgeBySeverityScatterPlot from "./LossByAgeBySeverityScatterPlot";
import PolicyLineLeader from "./PolicyLineLeader";
import { useNavigate } from "react-router-dom";

export default function PolicyLineStats({
    isOnSecondStep,
}: {
    isOnSecondStep: boolean;
}) {
    // const { guess } = useAppSelector((state) => state.actuary.guess);

    const grid = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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

    const isMobile = window.innerWidth < 992 || (grid.sm && !grid.md);

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
    };

    const onModalClose = () => {
        setIsRegisterModalOpen(false);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                position: "relative",
            }}
        >
            {!isMobile && (
                <GlassOverlay
                    blur={hasContributed || !stats ? 0 : isOnSecondStep ? 4 : 9}
                />
            )}

            <Spin spinning={getStatsPending}>
                {stats ? (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "white",
                            borderRadius: isMobile ? 0 : 16,

                            zIndex: 1,
                            padding: `1.5rem ${isMobile ? 1 : 2}.5rem ${
                                isMobile ? 3.5 : 2.5
                            }rem ${isMobile ? 1 : 2}.5rem`,
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
                                openRegisterModal={openRegisterModal}
                                policyLine={stats}
                                count={stats.actuary_details.count}
                                requiredCount={
                                    stats.actuary_details.loss_rate_summary
                                        .required_count_for_desired_confidence ||
                                    10
                                }
                            />
                            <Row>
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    lg={16}
                                    xl={12}
                                    xxl={12}
                                >
                                    <PolicyStatsHeadlineNumbers
                                        data={stats.actuary_details}
                                    />
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    lg={8}
                                    xl={12}
                                    xxl={12}
                                >
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
                            <Row>
                                <ManufacturerHistogram
                                    data={stats.actuary_details.manufacturers}
                                />
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
                    type="link"
                    target="_blank"
                    href="https://github.com/daxaxelrod/open_insure/tree/master/gatherer/utils.py"
                >
                    Math
                </Button>
            </div>
            {isMobile ? (
                <Drawer
                    title="Register to collect your badge"
                    placement={"bottom"}
                    closable={false}
                    onClose={onModalClose}
                    open={isRegisterModalOpen}
                    key={"bottom-modal"}
                    height={300}
                >
                    <MiniBadgeTeaser />
                </Drawer>
            ) : (
                <Modal
                    title="Register to collect your badge"
                    open={isRegisterModalOpen}
                    onCancel={onModalClose}
                    footer={null}
                >
                    <MiniBadgeTeaser />
                </Modal>
            )}
        </div>
    );
}

const MiniBadgeTeaser = () => {
    const navigate = useNavigate();
    return (
        <>
            <Row>
                <img
                    src={`${process.env.REACT_APP_CDN_URL}/badges/guess_contribution_badge.png`}
                    style={{
                        height: 120,
                        width: 120,
                        marginRight: 10,
                        objectFit: "contain",
                    }}
                    alt="earned badge icon"
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <span
                        style={{
                            fontSize: "2rem",
                            fontFamily: "Menlo",
                        }}
                    >
                        1x
                    </span>
                    <div
                        style={{
                            marginTop: 4,
                            fontSize: "1rem",
                            fontFamily: "Menlo",
                        }}
                    >
                        Contribution Badge
                    </div>
                </div>
            </Row>
            <Row>
                <Button
                    size="large"
                    type="primary"
                    style={{
                        width: "100%",
                        marginTop: 10,
                    }}
                    onClick={() => {
                        navigate("/join");
                    }}
                >
                    Register
                </Button>
            </Row>
        </>
    );
};
