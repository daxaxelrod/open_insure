import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { Claim, Policy, User } from "../../../../../redux/reducers/commonTypes";
import { useAppSelector } from "../../../../../redux/hooks";
import ClaimStatusBar from "./ClaimStatusBar";
import ClaimEvidenceImages from "./ClaimEvidenceImages";
import ClaimVoteStatus from "./ClaimVoteStatus";
import colors from "../../../../constants/colors";

const { Title, Paragraph } = Typography;

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
                <Paragraph style={{ color: colors.gray8 }}>
                    {claimant?.picture ? (
                        <img
                            src={claimant?.picture}
                            style={{
                                height: 25,
                                width: 25,
                                borderRadius: 15,
                                marginRight: 5,
                            }}
                            alt="user avatar"
                        />
                    ) : null}
                    {claimant?.first_name} {claimant?.last_name.slice(0, 1)}
                </Paragraph>
            </Row>
        </div>
    );
};

export default function PolicyClaimDetailCard({ claim, policy }: props) {
    const claimant = policy?.pod?.members.find(
        (member) => member.id === claim.claimant
    );

    return (
        <Col xs={24} sm={24} md={12} lg={12}>
            <Link to={`/policy/${policy.id}/claims/${claim.id}`}>
                <Card
                    title={<ClaimStatusBar claim={claim} />}
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
                            <ClaimVoteStatus claim={claim} policy={policy} />
                        </Col>
                    </Row>
                </Card>
            </Link>
        </Col>
    );
}
