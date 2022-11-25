import React, { useContext } from "react";
import { Card, Col, Image, Row } from "antd";
import colors from "../../../../constants/colors";
import {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
} from "@ant-design/icons";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";

export default function ClaimEvidence() {
    const { claim } = useContext(ClaimDetailContext);

    return (
        <Row>
            <Col span={3}></Col>
            <Col span={21}>
                <Image.PreviewGroup>
                    {claim?.evidence?.map((evidence) => (
                        <Image
                            key={"evidence-image-" + evidence.id}
                            width={200}
                            src={evidence.image}
                            alt="evidence"
                        />
                    ))}
                </Image.PreviewGroup>
            </Col>
        </Row>
    );
}
