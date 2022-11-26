import React, { useContext } from "react";
import { Button, Col, notification, Row, Statistic, Typography } from "antd";
import { patchCurrentUserClaimVote } from "../../../../../redux/actions/claims";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { ClaimApproval } from "../../../../../redux/reducers/commonTypes";
import { maybePluralize } from "../../../../utils/stringUtils";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import ClaimVoteStatus from "../list/ClaimVoteStatus";
import { SideText, ClaimVotingBox } from "./Styled";

const { Paragraph } = Typography;

export default function ClaimVotes() {
    const { claim, policy, claimant } = useContext(ClaimDetailContext);
    const dispatch = useAppDispatch();
    const [api, context] = notification.useNotification();
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    if (!claim || !policy) {
        return null;
    }

    let votes = claim?.approvals;

    let submittedVotes = votes?.filter((vote: ClaimApproval) => {
        return !!vote.approved_on;
    });

    let votesNeededToPass = Math.ceil(
        (policy.claim_approval_threshold_percentage / 100) * votes.length
    );
    let votesNotCast = votes.length - submittedVotes.length;

    const submitClaimVote = (decision: boolean) => {
        const userVote = votes.find((vote: ClaimApproval) => {
            return vote.approver === currentUser.id;
        });
        if (userVote) {
            dispatch(
                patchCurrentUserClaimVote(
                    policy.id,
                    claim.id,
                    userVote.id,
                    decision
                )
            );
        } else {
            api.info({
                message:
                    "It appears you have not yet been assigned a vote for this claim.",
                description: `Reach out to your policy administrator or escrow agent to get your vote assigned. `,
            });
        }
    };

    console.log(claimant?.id, currentUser.id);

    return (
        <Row style={{ margin: "20px 0" }}>
            {context}
            <Col span={3} style={{ marginTop: 8 }}>
                <SideText>{submittedVotes.length} Cast</SideText>
                <SideText>{votesNotCast} Not cast</SideText>
                <SideText>{votesNeededToPass} Needed to Pass</SideText>
            </Col>
            <Col span={21}>
                <Row align={"middle"}>
                    <Col span={12}>
                        <Row>
                            <Col span={12}>
                                {claimant?.id === currentUser.id ? (
                                    <ClaimVotingBox>
                                        <Paragraph>
                                            You are the claimant. You can't vote
                                            on your claim
                                        </Paragraph>
                                    </ClaimVotingBox>
                                ) : (
                                    <ClaimVotingBox>
                                        <Button
                                            style={{ marginBottom: 10 }}
                                            onClick={() =>
                                                submitClaimVote(true)
                                            }
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                submitClaimVote(false)
                                            }
                                        >
                                            Reject
                                        </Button>
                                    </ClaimVotingBox>
                                )}
                            </Col>
                            <Col
                                span={12}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {claim && policy && (
                                    <ClaimVoteStatus
                                        claim={claim}
                                        policy={policy}
                                        strokeWidth={18}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        span={12}
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                        }}
                    >
                        <Statistic
                            title="Minimum Agreement Threshold"
                            value={policy?.claim_approval_threshold_percentage}
                            suffix="%"
                        />
                        <Statistic
                            title="Votes needed to pass"
                            value={votesNeededToPass}
                        />
                        {/* <Statistic 
                            title="Votes due in"
                            value={claim.voting_deadline} backend driven, not started yet
                        /> */}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
