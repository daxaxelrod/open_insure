import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import {
    Claim,
    Policy,
    User,
} from "../../../../../redux/reducers/types/commonTypes";
import ClaimStatusBar from "./ClaimStatusBar";
import ClaimEvidenceImages from "./ClaimEvidenceImages";
import ClaimVoteStatus from "./ClaimVoteStatus";
import colors from "../../../../constants/colors";
import ClaimantShortDisplay from "../detail/ClaimantShortDisplay";
import moment from "moment-timezone";

const { Title } = Typography;

type props = {
    claim: Claim;
    policy: Policy;
};

const ClaimTitle = ({ claim, claimant }: { claim: Claim; claimant?: User }) => {
    return (
        <div>
            <Row justify="end">
                <Title level={4}>{claim.title}</Title>
            </Row>
            <Row justify="end">
                <ClaimantShortDisplay claimant={claimant} />
            </Row>
        </div>
    );
};

export default function PolicyClaimCard({ claim, policy }: props) {
    const claimant = policy?.pod?.members.find(
        (member) => member.id === claim.claimant
    );

    return (
        <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            className="claim-policy-card-container"
        >
            <Link to={`/policy/${policy.id}/claims/${claim.id}`}>
                <Card
                    title={
                        <ClaimStatusBar
                            claim={claim}
                            policyMajorityThreshold={
                                policy.claim_approval_threshold_percentage
                            }
                        />
                    }
                    hoverable
                    bordered={true}
                    style={{
                        minWidth: 250,
                        borderWidth: 3,
                        borderRadius: 15,
                        paddingBottom: 0,
                    }}
                    bodyStyle={{
                        padding: "24px 24px 12px 24px",
                    }}
                >
                    <Row>
                        <Col span={9}>
                            <ClaimEvidenceImages claim={claim} />
                        </Col>
                        <Col span={14} offset={1}>
                            <ClaimTitle claim={claim} claimant={claimant} />
                            <ClaimVoteStatus
                                claim={claim}
                                policy={policy}
                                withRedLine={false}
                            />
                            <span
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    color: colors.gray7,
                                    fontSize: "0.65rem",
                                }}
                            >
                                {moment(claim.created_at).fromNow()}
                            </span>
                        </Col>
                    </Row>
                </Card>
            </Link>
        </Col>
    );
}
