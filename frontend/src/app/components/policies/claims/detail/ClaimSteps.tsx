import { Col, Row, Steps } from "antd";
import React, { useContext } from "react";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";

export default function ClaimSteps() {
    const { claim, isClaimApproved } = useContext(ClaimDetailContext);

    const items = [
        { title: "Create" },
        { title: "Fill out", description: "Add more details to your claim" },
        { title: "Vote", description: "Members vote on your claim" },
    ];

    let current = 1;

    if (isClaimApproved) {
        current = 3;
    }

    if (claim && claim?.evidence?.length > 0) {
        current = 2;
    }

    return (
        <Row>
            <Col span={20} offset={2}>
                <Steps items={items} current={current} />
            </Col>
        </Row>
    );
}
