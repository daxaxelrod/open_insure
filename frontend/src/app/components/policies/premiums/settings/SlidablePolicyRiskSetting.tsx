import React from "react";
import { Col, Row, Slider, Typography } from "antd";

const { Paragraph } = Typography;

interface props {
    sliderOnChange: (value: number, identifier: string) => void;
    setDraggingValue: React.Dispatch<any>;
    identifier: string;
    draggingValue: any;
    value: number;
    min?: number;
    max?: number;
    stepSize?: number;
}

export default function SlidablePolicyRiskSetting({
    sliderOnChange,
    setDraggingValue,
    draggingValue,
    identifier,
    value,
    min = 1,
    max = 100,
    stepSize = 1,
}: props) {
    return (
        <Row>
            <Col span={14}>
                <Slider
                    min={min}
                    max={max}
                    step={stepSize}
                    onChange={(val) => sliderOnChange(val, identifier)}
                    value={value}
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
                <Paragraph>{value}%</Paragraph>
            </Col>
        </Row>
    );
}
