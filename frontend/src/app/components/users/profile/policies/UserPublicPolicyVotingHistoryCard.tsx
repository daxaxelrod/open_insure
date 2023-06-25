import React, { useContext } from "react";
import { PublicProfileContext } from "../../../contexts/PublicProfileContext";
import { Button, Card, Empty, Table, Typography } from "antd";
import {
    Claim,
    ClaimApproval,
    Policy,
} from "../../../../../redux/reducers/commonTypes";
import type { ColumnsType } from "antd/es/table";
import moment, { Moment } from "moment-timezone";
import { CheckCircleOutlined, MinusOutlined } from "@ant-design/icons";
import IconWithSubtext from "../../../common/IconWithSubtext";
import { maybePluralize } from "../../../../utils/stringUtils";

const { Title } = Typography;

interface ClaimVoteRowType extends Partial<ClaimApproval> {
    key: React.Key;
    cast_on: string;
    original_cast_on: string;
    comment: string;
    policy: Policy | undefined;
    timeTakenToVote: string | undefined;
}

function getTimeDiff(start: Moment, end: Moment) {
    const duration = moment.duration(end.diff(start));
    const days = duration.days();
    const hours = duration.hours();
    if (days === 0 && hours === 0) return "less than an hour";
    if (days === 0) return `${hours} ${maybePluralize(hours, "hour")}`;
    return `${days} ${maybePluralize(days, "day")} ${hours} ${maybePluralize(
        hours,
        "hour"
    )}`;
}

export default function UserPublicPolicyVotingHistoryCard() {
    const { votes, policies, user } = useContext(PublicProfileContext);

    const tableSource: ClaimVoteRowType[] | undefined = votes?.map(
        (vote: ClaimApproval) => {
            // @ts-ignore
            const relatedClaim: Claim = vote.claim;
            const relatedPolicy: Policy | undefined = relatedClaim
                ? policies?.find(
                      (policy: Policy) => policy.id === relatedClaim?.policy
                  )
                : undefined;

            return {
                ...vote,
                key: vote.id,
                cast_on: vote.updated_at,
                original_cast_on: vote.created_at,
                policy: relatedPolicy,
                fullClaim: relatedClaim,
                timeTakenToVote: relatedClaim
                    ? getTimeDiff(
                          moment(relatedClaim?.occurance_date),
                          moment(vote.created_at)
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
                    <Button
                        type="link"
                        href={`/claims/${claim?.id}`}
                        style={{
                            padding: "0px",
                        }}
                    >
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
            title: "Time Taken To Vote",
            dataIndex: "timeTakenToVote",
            key: "timeTakenToVote",
            render: (timeTakenToVote: string | undefined) => (
                <span>{timeTakenToVote ? timeTakenToVote : "N/a"}</span>
            ),
        },
    ];

    return (
        <Card bordered={true} style={{ marginTop: 10, marginBottom: 10 }}>
            <Title level={4}>Voting History</Title>
            <Table
                columns={tableColumns}
                dataSource={tableSource}
                pagination={{
                    position:
                        votes && votes?.length >= 5 ? ["bottomRight"] : [],
                }}
                locale={{
                    emptyText: (
                        <span>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span>
                                        {user?.first_name} has not cast any
                                        votes
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
