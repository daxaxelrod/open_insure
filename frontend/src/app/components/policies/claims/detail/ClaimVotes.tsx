import { Button, Col, notification, Row, Statistic } from "antd";
import React, { useContext } from "react";
import { useAppDispatch } from "../../../../../redux/hooks";
import { ClaimApproval } from "../../../../../redux/reducers/commonTypes";
import { maybePluralize } from "../../../../utils/stringUtils";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import ClaimVoteStatus from "../list/ClaimVoteStatus";
import { SideText, ClaimVotingBox } from "./Styled";

export default function ClaimVotes() {
    const { claim, policy } = useContext(ClaimDetailContext);
    const dispatch = useAppDispatch();
    const [api, context] = notification.useNotification();

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
        api.info({
            message: "todo, implement vote submit",
            description: `Vote: ${decision}`,
        });
    };

    return (
        <Row style={{ margin: "20px 0" }}>
            {context}
            <Col span={3} style={{ marginTop: 8 }}>
                <SideText>
                    {submittedVotes.length}{" "}
                    {maybePluralize(submittedVotes.length, "Vote")} Cast
                </SideText>
                <SideText>
                    {votesNotCast} {maybePluralize(votesNotCast, "Votes")} Not
                    cast
                </SideText>
                <SideText>
                    {votesNeededToPass}{" "}
                    {maybePluralize(votesNeededToPass, "Votes")} Needed to Pass
                </SideText>
            </Col>
            <Col span={21}>
                <Row align={"middle"}>
                    <Col>
                        <ClaimVotingBox>
                            <Button
                                style={{ marginBottom: 10 }}
                                onClick={() => submitClaimVote(true)}
                            >
                                Approve
                            </Button>
                            <Button onClick={() => submitClaimVote(false)}>
                                Reject
                            </Button>
                        </ClaimVotingBox>
                    </Col>
                    <Col
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        {claim && policy && (
                            <ClaimVoteStatus claim={claim} policy={policy} />
                        )}
                    </Col>
                </Row>
                <Row
                    gutter={20}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 15,
                    }}
                >
                    <Col>
                        <Statistic
                            title="Minimum Agreement Threshold"
                            value={policy?.claim_approval_threshold_percentage}
                            suffix="%"
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Num Policy Members"
                            value={votes.length}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Votes needed to pass"
                            value={votesNeededToPass}
                        />
                    </Col>
                    <Col>
                        <Statistic title="Views" value={"Todo"} />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
