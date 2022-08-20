import React from "react";
import { useParams } from "react-router-dom";
// import { useAppSelector } from "../../../redux/hooks";
import { Col, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function PublicProfile({}) {
    let { id } = useParams();

    return (
        <>
            <Row align="middle">
                <Col span={12}>
                    User image
                    <Title>Public Profile for user {id}</Title>
                </Col>
                <Col>
                    user credit score
                    <Title level={3}>99% trustworthy</Title>
                </Col>
            </Row>
            <Row>
                <Paragraph>Member of which policies</Paragraph>
                <Paragraph>Premiums paid</Paragraph>
            </Row>
            <Row>
                <Paragraph>Claim history</Paragraph>
            </Row>
            <Row>
                <Paragraph>Voting history</Paragraph>
            </Row>
        </>
    );
}
