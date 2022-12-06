import { Col, Dropdown, notification, Popconfirm, Row, Steps } from "antd";
import React, { useContext } from "react";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";

import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import moment from "moment-timezone";

export default function ClaimSteps() {
    const { claim, isClaimApproved } = useContext(ClaimDetailContext);
    const [api, contextHolder] = notification.useNotification();

    const dropdownItems: MenuProps["items"] = [
        {
            key: "1",
            label: "Delete Claim",
            danger: true,
            onClick: () => {
                api.error({
                    message: "Not Implemented yet",
                    description: "Ask your admin to delete this claim for you",
                });
            },
        },
    ];

    let items = [
        { title: "File Claim" },
        { title: "Vote", description: "Members vote on your claim" },
        { title: "Outcome", description: "Claim is approved or denied" },
    ];

    let current = 0;

    if (isClaimApproved) {
        current = 3;
        items[2] = {
            title: claim?.paid_on ? "Paid" : "Approved",
            description: claim?.paid_on
                ? `Paid on ${moment(claim?.paid_on).format("MM/DD/YY")}`
                : "Pending payout",
        };
    } else if (claim && claim?.evidence?.length > 0) {
        current = 1;
    }

    return (
        <Row>
            {contextHolder}
            <Col span={20} offset={3}>
                <Steps items={items} current={current} />
            </Col>
            <Col
                span={1}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                }}
            >
                <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
                    <EllipsisOutlined />
                </Dropdown>
            </Col>
        </Row>
    );
}
