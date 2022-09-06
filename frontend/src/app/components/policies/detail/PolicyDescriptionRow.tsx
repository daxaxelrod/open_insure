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
        name: "All others",
        description:
            "This is an extrememly liberal policy. Make your case to the group and let them decide",
        icon_name: "crown",
    },
];

export default function PolicyDescriptionRow({ policy }: { policy: Policy }) {
    return (
        <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
            <Title level={4}>Description</Title>
            <Row>
                <Col span={12}>{policy.description}</Col>
                <Col span={12}>
                    <Row>
                        {policy.perils.map((peril) => (
                            <Col
                                span={12}
                                style={{ padding: "2rem" }}
                                key={peril.id}
                            >
                                <PerilGridDisplay peril={peril} />
                            </Col>
                        ))}
                        {mockPerils.map((peril) => (
                            <Col
                                span={12}
                                style={{ padding: "2rem" }}
                                key={`${peril.id}-mock`}
                            >
                                <PerilGridDisplay peril={peril} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
