import { Typography } from "antd";
import React from "react";
import { User } from "../../../../redux/reducers/types/commonTypes";
import { MailOutlined } from "@ant-design/icons";
import colors from "../../../constants/colors";
import moment from "moment-timezone";

const { Title, Paragraph } = Typography;

export default function UserHeader({ user }: { user: User }) {
    return (
        <div>
            <Title>
                {user?.first_name} {user?.last_name}
            </Title>
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
