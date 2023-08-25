import React from "react";
import { Avatar, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/types/commonTypes";
import { UserOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import colors from "../../../constants/colors";
const { Text } = Typography;

export default function Title({ policy }: { policy: Policy }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <div>{policy.name}</div>
                {!policy.is_public ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <EyeInvisibleOutlined
                            style={{
                                marginRight: 4,
                                color: colors.gray7,
                            }}
                        />
                        <Text type="secondary">Private</Text>
                    </div>
                ) : null}
            </div>
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
