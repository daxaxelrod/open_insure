import { Button, Col, DatePicker, Row, Typography } from "antd";
import React, { useState } from "react";
import { Policy } from "../../../../redux/reducers/types/commonTypes";

const { Title, Paragraph } = Typography;

export default function PolicyDangerZone({ policy }: { policy: Policy }) {
    const closeoutPolicy = () => {
        console.log("Closing out policy");
    };

    return (
        <>
            <Title level={3}>Danger Zone</Title>

            <Row>
                <Col span={6}>
                    <Title level={5}>Terminate</Title>
                </Col>
                <Paragraph>
                    Initate a vote to terminate the policy. if the vote passes,
                    or if enough time passes, the policy will be terminated
                </Paragraph>
                <Col span={18}>
                    <div style={{ display: "flex" }}>
                        <Button onClick={closeoutPolicy} danger>
                            Closeout Policy
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    );
}
