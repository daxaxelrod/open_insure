import { Flex, Typography } from "antd";
import React from "react";
import { User } from "../../../../redux/reducers/types/commonTypes";
import { LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
import colors from "../../../constants/colors";
import moment from "moment-timezone";

const { Title, Paragraph } = Typography;

export default function UserHeader({ user }: { user: User }) {
    return (
        <div>
            <Title style={{ marginBottom: ".25rem" }}>
                {user?.first_name} {user?.last_name}
            </Title>
            <Flex
                gap={10}
                style={{
                    backgroundColor: colors.gray1,
                    marginBottom: ".25rem",
                }}
            >
                {user?.linkedin_url && (
                    <LinkedinOutlined style={{ color: colors.linkColor }} />
                )}
                {user?.twitter_url && (
                    <TwitterOutlined style={{ color: colors.linkColor }} />
                )}
            </Flex>
            <Paragraph
                style={{
                    color: colors.gray8,
                }}
            >
                Member for {moment(user?.created_at).fromNow(true)}
            </Paragraph>
        </div>
    );
}
