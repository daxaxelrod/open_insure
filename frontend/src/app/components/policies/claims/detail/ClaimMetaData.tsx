import React, { useContext } from "react";
import { Col, Row, Typography } from "antd";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import moment from "moment-timezone";
import colors from "../../../../constants/colors";
import { SideText, CaptionText, ClaimMetaDataContainer } from "./Styled";
import ClaimEvidence from "./ClaimEvidence";
import ClaimantShortDisplay from "./ClaimantShortDisplay";
import { useAppSelector } from "../../../../../redux/hooks";

const { Title, Paragraph } = Typography;

export default function ClaimMetaData() {
    const { claim, claimant } = useContext(ClaimDetailContext);
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    return (
        <ClaimMetaDataContainer top={currentUser?.id === claimant?.id}>
            <Row style={{ marginBottom: "1.5rem" }}>
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
                <Col span={6}>
                    <Title level={2} style={{ marginBottom: 0 }}>
                        ${(claim?.amount || 0) / 100}
                    </Title>
                    <Title level={3} style={{ marginTop: 0 }}>
                        {claim?.title}
                    </Title>
                </Col>
                <Col span={10}>
                    <ClaimEvidence />
                </Col>
            </Row>
            <Row>
                <Col span={6} offset={3}>
                    <CaptionText>Description</CaptionText>
                    <Paragraph style={{ marginBottom: ".5rem" }}>
                        {claim?.description}
                    </Paragraph>
                    <CaptionText>Loss happened on</CaptionText>
                    <Paragraph>
                        {moment(claim?.occurance_date).format("MM-DD-YYYY")}
                    </Paragraph>
                </Col>
                <Col span={10}>
                    <CaptionText>Location</CaptionText>
                    <Paragraph style={{ marginBottom: ".5rem" }}>
                        {claim?.location_description}
                    </Paragraph>
                    <CaptionText>Filed by</CaptionText>
                    <ClaimantShortDisplay claimant={claimant} linkToProfile />
                </Col>
            </Row>
        </ClaimMetaDataContainer>
    );
}
