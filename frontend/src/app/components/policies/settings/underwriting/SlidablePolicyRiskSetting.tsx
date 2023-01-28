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
    inBasisPoints?: boolean;
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
    inBasisPoints = false,
}: props) {
    return (
        <Row>
            <Col span={18}>
                <Slider
                    min={min}
                    max={max}
                    step={stepSize}
                    onChange={(val) =>
                        sliderOnChange(
                            inBasisPoints ? Math.round(val * 100) : val,
                            identifier
                        )
                    }
                    value={inBasisPoints ? value / 100 : value}
                    onAfterChange={() =>
                        setDraggingValue({
                            ...draggingValue,
                            [identifier]: false,
                        })
                    }
                />
            </Col>
            <Col
                span={6}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paragraph>{value / (inBasisPoints ? 100 : 1)}%</Paragraph>
            </Col>
        </Row>
    );
}
