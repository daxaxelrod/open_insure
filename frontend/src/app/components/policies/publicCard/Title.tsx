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
                <Avatar.Group maxCount={2} size={"default"}>
                    {policy?.pod?.members?.map((member) => (
                        <Avatar
                            key={member?.id}
                            src={member?.picture}
                            icon={<UserOutlined />}
                        />
                    ))}
                </Avatar.Group>
            </div>
        </div>
    );
}
