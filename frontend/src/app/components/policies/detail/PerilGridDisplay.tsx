import React from "react";
import { Peril } from "../../../../redux/reducers/commonTypes";
import { MehOutlined, AlertOutlined, CrownOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip, Typography } from "antd";

const { Title } = Typography;

const getIconForPeril = (peril: Peril) => {
    switch (peril.icon_name) {
        case "alert":
            return <AlertOutlined style={{ fontSize: "2rem" }} />;
        case "meh":
            return <MehOutlined style={{ fontSize: "2rem" }} />;
        case "crown":
            return <CrownOutlined style={{ fontSize: "2rem" }} />;
        default:
            return null;
    }
};

export default function PerilGridDisplay({ peril }: { peril: Peril }) {
    let icon = getIconForPeril(peril);
    return (
        <Tooltip title={peril.description}>
            <Row>
                <Col span={4}>{icon}</Col>
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Title level={5} style={{ marginBottom: 0 }}>
                        {peril.name}
                    </Title>
                </Col>
            </Row>
        </Tooltip>
    );
}
