import React from "react";
import { Peril } from "../../../../redux/reducers/commonTypes";
import {
    MehOutlined,
    AlertOutlined,
    CrownOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { Col, Row, Tooltip, Typography } from "antd";

const { Paragraph } = Typography;

const getIconForPeril = (peril: Peril) => {
    switch (peril.icon_name) {
        case "alert":
            return <AlertOutlined style={{ fontSize: "2rem" }} />;
        case "meh":
            return <MehOutlined style={{ fontSize: "2rem" }} />;
        case "crown":
            return <CrownOutlined style={{ fontSize: "2rem" }} />;
        case "ThunderboltOutlined":
            return <ThunderboltOutlined style={{ fontSize: "2rem" }} />;
        default:
            return null;
    }
};

export default function PerilGridDisplay({ peril }: { peril: Peril }) {
    let icon = getIconForPeril(peril);
    return (
        <Tooltip title={peril.description} color="black">
            <Row>
                {icon}
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Paragraph style={{ marginBottom: 0, marginLeft: 15 }}>
                        {peril.name}
                    </Paragraph>
                </Col>
            </Row>
        </Tooltip>
    );
}
