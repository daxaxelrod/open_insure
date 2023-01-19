import React, { useState } from "react";
import {
    Button,
    Col,
    DatePicker,
    Input,
    notification,
    Row,
    Typography,
} from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { useAppDispatch } from "../../../../redux/hooks";
import { updatePolicyDuration } from "../../../../redux/actions/renewals";
import RenewalsListTable from "./renewals/RenewalsListTable";

const { Title, Paragraph } = Typography;

export default function PolicyExtensionSettings({
    policy,
}: {
    policy: Policy;
}) {
    const [policyDesiredExtension, setPolicyDesiredExtension] = useState<
        number | null | undefined
    >();
    const dispatch = useAppDispatch();

    const requestPolicyExtension = () => {
        console.log("Requesting extension to", policyDesiredExtension);
        if (policyDesiredExtension) {
            dispatch(updatePolicyDuration(policy.id, policyDesiredExtension));
        } else {
            notification.warning({
                message: "Please enter a valid number",
            });
        }
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
                        <Input
                            type="number"
                            onChange={(e) =>
                                setPolicyDesiredExtension(
                                    parseInt(e.target.value)
                                )
                            }
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
            <div>
                <Title level={4}>Renewals</Title>
                <RenewalsListTable policy={policy} />
            </div>
        </>
    );
}
