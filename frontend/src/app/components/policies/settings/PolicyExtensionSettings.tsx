import React, { useState } from "react";
import { Button, Col, DatePicker, Row, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";

const { Title, Paragraph } = Typography;

export default function PolicyExtensionSettings({
    policy,
}: {
    policy: Policy;
}) {
    const [policyDesiredExtension, setPolicyDesiredExtension] = useState<
        string | null
    >();

    const requestPolicyExtension = () => {
        console.log("Requesting extension to", policyDesiredExtension);
    };

    return (
        <>
            <Row>
                <Title level={4}>Extend</Title>
                <Col span={6}>
                    <Paragraph>
                        The current policy period started on{" "}
                        {policy.coverage_start_date} and goes on for{" "}
                        {policy.coverage_duration} months. You can use this form
                        to extend the policy period but note that each user will
                        get the choice to opt out of the extension.
                    </Paragraph>
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
        </>
    );
}
