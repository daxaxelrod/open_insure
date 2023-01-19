import React, { useState } from "react";
import {
    Button,
    Col,
    DatePicker,
    Descriptions,
    Divider,
    Input,
    notification,
    Row,
    Space,
    Typography,
} from "antd";
import { Policy, Renewal } from "../../../../redux/reducers/commonTypes";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { updatePolicyDuration } from "../../../../redux/actions/renewals";
import RenewalsListTable from "./renewals/RenewalsListTable";
import moment from "moment-timezone";

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
    const renewals: Renewal[] =
        useAppSelector((state) => state.policies.renewals?.[policy.id]) || [];
    const createRenewalPending = useAppSelector(
        (state) => state.policies.createRenewalPending
    );

    const numberOfPolicyExtensions = renewals?.length || 0;

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
            <Title level={4}>Extend</Title>
            <Row>
                <Col span={13}>
                    <Paragraph>
                        Extend a policy beyond its original start date. You can
                        use this form to extend the policy period but note that
                        each user will get the choice to opt out of the
                        extension.
                    </Paragraph>
                    <Descriptions title="Policy Details">
                        <Descriptions.Item label="Original Start Date">
                            {moment(policy.coverage_start_date).format("LL")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration in months">
                            {policy.coverage_duration}
                        </Descriptions.Item>
                        <Descriptions.Item label="Number of renewals">
                            {numberOfPolicyExtensions}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={10}>
                    <div style={{ display: "flex" }}>
                        <Space>
                            <Input
                                type="number"
                                onChange={(e) =>
                                    setPolicyDesiredExtension(
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                            <Button
                                onClick={requestPolicyExtension}
                                loading={createRenewalPending}
                            >
                                Extend Policy{" "}
                                {policyDesiredExtension
                                    ? `${policyDesiredExtension} months`
                                    : ""}
                            </Button>
                        </Space>
                    </div>
                </Col>
            </Row>
            <div>
                <Divider />
                <Title level={5}>Existing Renewals</Title>
                <RenewalsListTable policy={policy} />
            </div>
        </>
    );
}
