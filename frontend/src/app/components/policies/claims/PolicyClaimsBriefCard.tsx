import React from "react";
import { Card, Col, Row, Statistic, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Claim, Policy } from "../../../../redux/reducers/commonTypes";
import colors from "../../../constants/colors";

export default function PolicyClaimsBriefCard({ policy }: { policy: Policy }) {
    let numPendingClaims = policy?.claims?.filter(
        (claim) =>
            claim.approvals.length < policy.claim_approval_threshold_percentage
    ).length;

    let claimsByUser = policy?.claims?.reduce(
        (acc: Record<number, number>, claim: Claim) => {
            if (acc[claim.claimant]) {
                acc[claim.claimant] += 1;
            } else {
                acc[claim.claimant] = 1;
            }
            return acc;
        },
        {}
    ); // might be useful later
    let averageClaimsPerUser =
        (100 * policy?.claims?.length) / (policy?.pod?.members?.length || 1);

    return (
        <Card
            style={{
                display: "flex",
                flex: 1,
            }}
            bordered={false}
            bodyStyle={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
            }}
        >
            <Row>
                <Col span={12}>
                    <Statistic
                        title="Number of claims"
                        value={policy?.claims?.length}
                    />
                </Col>
                <Col>
                    <Row>
                        <Col span={20}>
                            <Statistic
                                title="Incidence rate"
                                value={averageClaimsPerUser}
                                suffix="%"
                            />
                        </Col>
                        <Col span={2}>
                            <Tooltip
                                color="black"
                                placement="leftTop"
                                title={() => (
                                    <div style={{ padding: 10 }}>
                                        How many claims each individual files on
                                        average
                                        {/* maybe this can get redefined later */}
                                    </div>
                                )}
                            >
                                <QuestionCircleOutlined
                                    style={{
                                        color: colors.gray7,
                                        padding: "3px 10px 10px 3px",
                                    }}
                                />
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row style={{ margin: 0 }}>
                <Tooltip
                    placement="bottom"
                    title={
                        "Claims that have been submitted but not voted on yet"
                    }
                ></Tooltip>
            </Row>
        </Card>
    );
}
