import { Button, Col, DatePicker, Row, Typography } from "antd";
import React, { useState } from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";

const { Title } = Typography;

export default function PolicyDangerZone({ policy }: { policy: Policy }) {
    const [policyDesiredExtension, setPolicyDesiredExtension] = useState<
        string | null
    >();

    const requestPolicyExtension = () => {
        console.log("Requesting extension to", policyDesiredExtension);
    };

    const closeoutPolicy = () => {
        console.log("Closing out policy");
    };

    return (
        <>
            <Title level={3}>Danger Zone</Title>
            <Row>
                <Col span={6}>
                    <Title level={5}>Extend</Title>
                </Col>
                <Col span={18}>
                    <div style={{ display: "flex" }}>
                        <DatePicker
                            onChange={(_, dateString) =>
                                setPolicyDesiredExtension(dateString)
                            }
                            picker="month"
                        />
                        <Button onClick={requestPolicyExtension}>
                            Extend Policy{" "}
                            {policyDesiredExtension
                                ? `to ${policyDesiredExtension}`
                                : ""}
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={6}>
                    <Title level={5}>Terminate</Title>
                </Col>
                <Col span={18}>
                    <div style={{ display: "flex" }}>
                        <Button onClick={closeoutPolicy}>
                            Closeout Policy
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    );
}
