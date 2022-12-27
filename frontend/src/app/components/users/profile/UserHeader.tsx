import { Typography } from "antd";
import React from "react";
import { User } from "../../../../redux/reducers/commonTypes";
import { MailOutlined } from "@ant-design/icons";
import colors from "../../../constants/colors";

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
                <MailOutlined style={{ marginRight: 6 }} color={colors.gray8} />
                {user?.email}
            </Paragraph>
        </div>
    );
}
