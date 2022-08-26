import React from "react";
import { Col, Row, Typography } from "antd";
import { Peril, Policy } from "../../../../redux/reducers/commonTypes";
import PerilGridDisplay from "./PerilGridDisplay";

const { Title } = Typography;

const mockPerils: Peril[] = [
    {
        name: "Water Damage",
        id: 1,
        description:
            "Spilled water on it or dropped in the toilet, doesnt matter",
        icon_name: "alert",
    },
    {
        id: 2,
        name: "Broken Screen",
        description: "Screen cracked or broken",
        icon_name: "meh",
    },
    {
        id: 3,
        name: "Just cause",
        description: "Whatever other reason people want to cover",
        icon_name: "crown",
    },
];

export default function PolicyDescriptionRow({ policy }: { policy: Policy }) {
    return (
        <div style={{ marginTop: "1rem" }}>
            <Title level={4}>Description</Title>
            <Row>
                <Col span={12}>{policy.description}</Col>
                <Col span={12}>
                    <Row>
                        {policy.perils.map((peril) => (
                            <PerilGridDisplay peril={peril} />
                        ))}
                        {mockPerils.map((peril) => (
                            <Col span={12} style={{ padding: "1rem" }}>
                                <PerilGridDisplay peril={peril} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
