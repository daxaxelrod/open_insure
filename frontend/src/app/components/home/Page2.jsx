import React from "react";
import { List, Typography } from "antd";
import QueueAnim from "rc-queue-anim";
import OverPack from "rc-scroll-anim/lib/ScrollOverPack";

import "./static/indexSectionTwo.css";

const { Title } = Typography;

const howItWorksList = [
    "You can create a group and invite your friends to join. ",
    "Determine premiums using sliders and pick a policy start date.",
    'Select a user to be the "escrow manager".',
    "If a claim is made, Vote with your group to approve or deny the claim. ",
    "If a claim is approved, the escrow manager will pay the claim. ",
    "If there is money left in the escrow, it will be distributed evenly to the group members.",
];

export default function Page2() {
    return (
        <OverPack component="section" className="page-wrapper page2">
            <QueueAnim
                type="bottom"
                className="page text-center"
                leaveReverse
                key="page"
            >
                <Title
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        fontSize: "2.2rem",
                    }}
                >
                    Here's how it works
                </Title>
                <span key="line" className="separator" />
                <QueueAnim type="bottom" className="info-content" key="content">
                    <List
                        style={{ paddingHorizontal: "20px" }}
                        dataSource={howItWorksList}
                        split={false}
                        renderItem={(item, idx) => (
                            <List.Item className="howItWorksListItem">
                                {idx + 1}.&nbsp;&nbsp;&nbsp;&nbsp;{item}
                            </List.Item>
                        )}
                    />
                </QueueAnim>
            </QueueAnim>
        </OverPack>
    );
}
