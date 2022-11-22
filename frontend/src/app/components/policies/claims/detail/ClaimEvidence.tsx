import React, { useContext } from "react";
import { Card, Col, Row } from "antd";
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
            <Col span={3}>
                <span style={{ fontSize: 12, color: colors.gray7 }}>Todo</span>
            </Col>
            <Col span={21}>
                <Card
                    actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]}
                    title={"Evidence"}
                ></Card>
            </Col>
        </Row>
    );
}
