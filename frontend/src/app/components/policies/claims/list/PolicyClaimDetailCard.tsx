import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { Claim, Policy, User } from "../../../../../redux/reducers/commonTypes";
import { useAppSelector } from "../../../../../redux/hooks";
import ClaimStatusBar from "./ClaimStatusBar";
import ClaimEvidenceImages from "./ClaimEvidenceImages";
import ClaimVoteStatus from "./ClaimVoteStatus";

const { Title, Paragraph } = Typography;

type props = {
    claim: Claim;
    policy: Policy;
};

const ClaimTitle = ({ claim, claimant }: { claim: Claim; claimant?: User }) => {
    return (
        <div>
            <Title level={4}>{claim.title}</Title>
            <Row justify="end">
                <Paragraph>
                    Submitted by {claimant?.first_name}{" "}
                    {claimant?.last_name.slice(0, 1)}
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
                        <Col span={6}>
                            <ClaimEvidenceImages claim={claim} />
                        </Col>
                        <Col span={18}>
                            <ClaimTitle claim={claim} claimant={claimant} />
                            <ClaimVoteStatus claim={claim} policy={policy} />
                        </Col>
                    </Row>
                </Card>
            </Link>
        </Col>
    );
}
