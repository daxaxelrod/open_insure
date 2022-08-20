import { Col, Row, Statistic, Typography } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;

export default function UserMainPremiumObligation() {
    let hasNextPayment = true;
    return (
        <Row>
            <Col>
                <Title>You Premium</Title>
                <Statistic value={"$20"} />
                <Paragraph>
                    {hasNextPayment ? "Next payment due Jan blah blah" : null}
                </Paragraph>
            </Col>
        </Row>
    );
}
