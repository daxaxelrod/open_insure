import React from "react";
import { Peril } from "../../../../redux/reducers/commonTypes";
import { MehOutlined, AlertOutlined, CrownOutlined } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";

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
        <Row>
            <Col span={4}>{icon}</Col>
            <Col>
                <Title level={5}>{peril.name}</Title>
            </Col>
        </Row>
    );
}
