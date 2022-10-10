import React from "react";
import { Col, Row, Slider, Typography } from "antd";
import { RiskSettings } from "../../../../../redux/reducers/commonTypes";

const { Paragraph } = Typography;

interface props {
    sliderOnChange: (value: number, identifier: string) => void;
    setDraggingValue: React.Dispatch<any>;
    identifier: string;
    draggingValue: any;
    initialValue: any;
}

export default function SlidablePolicyRiskSetting({
    sliderOnChange,
    setDraggingValue,
    draggingValue,
    identifier,
    initialValue,
}: props) {
    return (
        <Row>
            <Col span={14}>
                <Slider
                    min={1}
                    max={100}
                    onChange={(val) => sliderOnChange(val, identifier)}
                    defaultValue={initialValue}
                    onAfterChange={() =>
                        setDraggingValue({
                            ...draggingValue,
                            [identifier]: false,
                        })
                    }
                />
            </Col>
            <Col
                span={10}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paragraph>{initialValue}%</Paragraph>
            </Col>
        </Row>
    );
}
