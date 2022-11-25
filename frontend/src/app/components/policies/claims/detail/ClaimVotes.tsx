import { Col, Row, Statistic } from "antd";
import React, { useContext } from "react";
import { ClaimApproval } from "../../../../../redux/reducers/commonTypes";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import ClaimVoteStatus from "../list/ClaimVoteStatus";
import { SideText } from "./Styled";

export default function ClaimVotes() {
    const { claim, policy } = useContext(ClaimDetailContext);

    if (!claim || !policy) {
        return null;
    }

    let votes = claim?.approvals;

    let submittedVotes = votes?.filter((vote: ClaimApproval) => {
        return vote.approved_on !== undefined;
    });

    return (
        <Row>
            <Col span={3}>
                <SideText>{submittedVotes.length} Votes Cast</SideText>
                <SideText>
                    {votes.length - submittedVotes.length} Votes Pending
                </SideText>
            </Col>
            <Col span={21}>
                {claim && policy && (
                    <ClaimVoteStatus claim={claim} policy={policy} />
                )}
                <Row gutter={20}>
                    <Col>
                        <Statistic
                            title="Policy Minimum agreement threshold"
                            value={policy?.claim_approval_threshold_percentage}
                            suffix="%"
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
