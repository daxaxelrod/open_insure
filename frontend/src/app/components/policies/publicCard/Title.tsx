import { Avatar } from "antd";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { UserOutlined } from "@ant-design/icons";
import { maybePluralize } from "../../../utils/stringUtils";

export default function Title({ policy }: { policy: Policy }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <div>{policy.name}</div>
            <div
                style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Avatar.Group maxCount={2}>
                    {policy?.pod?.members?.map((member) => (
                        <Avatar
                            key={member?.id}
                            src={member?.picture}
                            icon={<UserOutlined />}
                        />
                    ))}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 12,
                        }}
                    >
                        &nbsp;
                        {policy?.pod?.members?.length ? ` ${policy?.pod?.members?.length} ${maybePluralize(policy?.pod?.members?.length, "member")}` : ''}
                        &nbsp;
                    </div>
                </Avatar.Group>
            </div>
        </div>
    );
}
