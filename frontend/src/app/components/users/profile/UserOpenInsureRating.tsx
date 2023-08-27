import React from "react";
import { Progress } from "antd";
import { User } from "../../../../redux/reducers/types/commonTypes";
import colors from "../../../constants/colors";
import { Typography } from "antd";

const { Title } = Typography;

export default function UserOpenInsureRating({ user }: { user: User }) {
    return (
        <div>
            <Progress
                type="dashboard"
                percent={99}
                strokeColor={{ "0%": colors.good, "100%": colors.lightGood }}
            />

            <Title level={4}>trustworthy score</Title>
        </div>
    );
}
