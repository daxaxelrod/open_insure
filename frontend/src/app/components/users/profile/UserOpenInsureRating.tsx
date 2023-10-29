import React from "react";
import { Col, Flex, Progress, Row } from "antd";
import { User } from "../../../../redux/reducers/types/commonTypes";
import colors from "../../../constants/colors";
import { Typography } from "antd";

const { Title } = Typography;

export default function UserOpenInsureRating({ user }: { user: User }) {
    const trustworthinessScore = 99;

    return (
        <>
            <Flex>
                <Progress
                    type="dashboard"
                    percent={99}
                    strokeColor={{
                        "0%": colors.good,
                        "100%": colors.lightGood,
                    }}
                />
            </Flex>
            <Flex>
                <Col>
                    <Title level={4}>trustworthy score</Title>
                </Col>
            </Flex>
        </>
    );
}
