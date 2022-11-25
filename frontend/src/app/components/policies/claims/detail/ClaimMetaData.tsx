import React, { useContext } from "react";
import { Col, Row, Typography } from "antd";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import moment from "moment-timezone";
import colors from "../../../../constants/colors";
import { SideText } from "./Styled";

const { Title, Paragraph } = Typography;

export default function ClaimMetaData() {
    const { claim } = useContext(ClaimDetailContext);

    return (
        <div className="claim-metadata">
            <Row>
                <Col
                    span={3}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 8,
                    }}
                >
                    <SideText>
                        {moment(claim?.created_at).format("MMMM Do YYYY")}
                    </SideText>
                    <SideText>
                        {moment(claim?.created_at).format("h:mm a")}
                    </SideText>
                </Col>
                <Col span={21}>
                    <Title level={3}>{claim?.title}</Title>
                    <Paragraph>{claim?.description}</Paragraph>
                </Col>
            </Row>
        </div>
    );
}
