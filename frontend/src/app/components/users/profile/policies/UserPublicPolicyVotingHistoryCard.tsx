import React, { useContext } from "react";
import { PublicProfileContext } from "../../../contexts/PublicProfileContext";
import { Button, Card, Empty, Table, Typography } from "antd";
import {
    Claim,
    ClaimApproval,
    Policy,
} from "../../../../../redux/reducers/commonTypes";
import type { ColumnsType } from "antd/es/table";
import moment from "moment-timezone";
import { CheckCircleOutlined, MinusOutlined } from "@ant-design/icons";
import IconWithSubtext from "../../../common/IconWithSubtext";

const { Title } = Typography;

interface ClaimVoteRowType extends Partial<ClaimApproval> {
    key: React.Key;
    cast_on: string;
    original_cast_on: string;
    comment: string;
    fullClaim: Claim | undefined;
    policy: Policy | undefined;
    timeTakenToVote: string | undefined;
}

export default function UserPublicPolicyVotingHistoryCard() {
    const { votes, policies, user } = useContext(PublicProfileContext);
    const allClaimsForUserInvolvedPolicies: Claim[] | undefined =
        policies?.reduce((claims: Claim[], policy: Policy) => {
            return [...claims, ...policy.claims];
        }, []);

    const tableSource: ClaimVoteRowType[] | undefined = votes?.map(
        (vote: ClaimApproval) => {
            const relatedClaim: Claim | undefined =
                allClaimsForUserInvolvedPolicies?.find(
                    (claim: Claim) => claim.id === vote.claim
                );
            const relatedPolicy: Policy | undefined = relatedClaim
                ? policies?.find(
                      (policy: Policy) => policy.id === relatedClaim?.policy
                  )
                : undefined;

            vote.approved;

            return {
                ...vote,
                key: vote.id,
                cast_on: vote.updated_at,
                original_cast_on: vote.created_at,
                policy: relatedPolicy,
                fullClaim: relatedClaim,
                timeTakenToVote: relatedClaim
                    ? moment(vote.created_at).diff(
                          relatedClaim?.occurance_date,
                          "hours"
                      )
                    : undefined,
            };
        }
    );

    const tableColumns: ColumnsType<ClaimVoteRowType> = [
        {
            title: "Policy",
            dataIndex: "policy",
            key: "policy",
            render: (policy: Policy) => policy?.name,
        },
        {
            title: "Claim",
            dataIndex: "claim",
            key: "claim",
            render: (claim?: Claim) =>
                claim ? (
                    <Button type="link" href={`/claims/${claim?.id}`}>
                        {claim?.title}
                    </Button>
                ) : (
                    "N/a"
                ),
        },
        {
            title: "Vote",
            dataIndex: "approved",
            key: "approved",
            render: (vote: boolean) =>
                vote ? (
                    <IconWithSubtext
                        icon={<CheckCircleOutlined />}
                        subtext="Approved"
                    />
                ) : (
                    <IconWithSubtext
                        icon={<MinusOutlined />}
                        subtext="Rejected"
                    />
                ),
        },
        {
            title: "Approved",
            dataIndex: "approved",
            key: "approved",
        },
        {
            title: "Paid On",
            dataIndex: "paid_on",
            key: "paid_on",
            render: (date: Date) => moment(date).format("MMM Do,YYYY"),
        },
    ];

    return (
        <Card bordered={true} style={{ marginTop: 10, marginBottom: 10 }}>
            <Title level={4}>Claims</Title>
            <Table
                columns={tableColumns}
                dataSource={tableSource}
                pagination={{ position: [] }}
                locale={{
                    emptyText: (
                        <span>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span>
                                        {user?.first_name} has not made any
                                        claims.
                                    </span>
                                }
                            />
                        </span>
                    ),
                }}
            />
        </Card>
    );
}
