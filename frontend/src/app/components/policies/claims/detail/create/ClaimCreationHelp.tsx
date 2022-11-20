import React, { useState } from "react";
import { Row, Col, Typography, Select, Card } from "antd";
import { getCostPerType } from "../../utils/cost";
import {
    DownSquareOutlined,
    UpSquareOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import colors from "../../../../../constants/colors";

const { Title, Paragraph } = Typography;

export default function ClaimCreationHelp() {
    const [showHelp, setShowHelp] = useState(false);
    const [selectedDamageView, setSelectedDamageView] = useState<string>();
    // const userRisk = useAppSelector(state => state.user.);

    return (
        <Card>
            <Row
                justify="space-between"
                style={{ cursor: "pointer" }}
                onClick={() => setShowHelp(!showHelp)}
            >
                <Title level={5}>
                    <QuestionCircleOutlined style={{ marginRight: 6 }} />
                    Need Help?
                </Title>
                <div
                    style={{
                        cursor: "pointer",
                        padding: "2px 10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                    }}
                >
                    {!showHelp ? <DownSquareOutlined /> : <UpSquareOutlined />}
                </div>
            </Row>
            {showHelp && (
                <div style={{ marginTop: 10 }}>
                    <Row>
                        <Paragraph
                            style={{
                                color: colors.gray7,
                            }}
                        >
                            For reference, here's what it costs to repair
                            various phone damages. Results may vary, google is
                            your friend.
                        </Paragraph>
                    </Row>
                    <Row justify="space-between" style={{ marginTop: 10 }}>
                        <Paragraph>Prices</Paragraph>
                        <Select
                            defaultValue="iphone11"
                            style={{ width: 120 }}
                            onChange={(val) => {
                                setSelectedDamageView(val);
                            }}
                            options={[
                                {
                                    value: "iphone11",
                                    label: "Iphone 11",
                                },
                                {
                                    value: "iphone14",
                                    label: "Iphone 14",
                                },
                                {
                                    value: "airpodsMax",
                                    label: "Airpods Max",
                                },
                            ]}
                        />
                    </Row>
                    <table
                        style={{
                            width: "70%",
                        }}
                    >
                        <tr>
                            <th style={{ textAlign: "left" }}>Repair</th>
                            <th style={{ textAlign: "left" }}>Cost</th>
                        </tr>
                        <tr>
                            <td>Battery</td>
                            <td>
                                ${getCostPerType("battery", selectedDamageView)}
                            </td>
                        </tr>
                        <tr>
                            <td>Screen Replacement</td>
                            <td>
                                ${getCostPerType("screen", selectedDamageView)}
                            </td>
                        </tr>
                        <tr>
                            <td>Charging Port fix</td>
                            <td>
                                $
                                {getCostPerType(
                                    "chargingPort",
                                    selectedDamageView
                                )}
                            </td>
                        </tr>
                    </table>
                </div>
            )}
        </Card>
    );
}
