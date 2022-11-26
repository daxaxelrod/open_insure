import React, { useContext } from "react";
import { Card, Col, Image, Row, Space } from "antd";
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
                    <Space size={12}>
                        {claim?.evidence?.map((evidence) => (
                            <Image
                                key={"evidence-image-" + evidence.id}
                                width={140}
                                height={120}
                                src={evidence.image}
                                alt="evidence"
                                style={{
                                    borderRadius: 12,
                                    objectFit: "cover",
                                }}
                            />
                        ))}
                    </Space>
                </Image.PreviewGroup>
            </Col>
        </Row>
    );
}
