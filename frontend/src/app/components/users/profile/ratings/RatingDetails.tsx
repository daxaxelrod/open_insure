import React from "react";
import { ReputationDetails } from "../../../../../redux/reducers/types/commonTypes";
import { Button, Flex, Row, Space, notification } from "antd";
import colors from "../../../../constants/colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { NoMarginParagraph } from "../../../common/CommonStyled";
import { createReputationAudit } from "../../../../../networking/users";
import { useAppSelector } from "../../../../../redux/hooks";
dayjs.extend(relativeTime);

export default function RatingDetails({
    reputation,
}: {
    reputation: ReputationDetails | undefined;
}) {
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const [api, contextHolder] = notification.useNotification();

    const requestAudit = async () => {
        const response = await createReputationAudit(currentUser.id);
        if (response?.status === 200) {
            api.success({
                message: "Success",
                description:
                    "Your request has been sent. You will be notified when the audit is complete.",
            });
        } else {
            api.error({
                message: "Error",
                description: "Your request could not be sent.",
            });
        }
    };

    if (!reputation || !reputation?.components) return null;

    return (
        <Row>
            {contextHolder}
            <Space size={"middle"}>
                <div>
                    <NoMarginParagraph color={colors.gray8} size={".65rem"}>
                        Calculated
                    </NoMarginParagraph>
                    <NoMarginParagraph color={colors.gray10} size={".85rem"}>
                        {dayjs(reputation.calculated_on).fromNow()}
                    </NoMarginParagraph>
                </div>
                <div>
                    <NoMarginParagraph color={colors.gray8} size={".65rem"}>
                        Next refresh
                    </NoMarginParagraph>
                    <NoMarginParagraph color={colors.gray10} size={".85rem"}>
                        {dayjs(reputation.next_refresh_available).fromNow()}
                    </NoMarginParagraph>
                </div>
            </Space>
            <Flex vertical flex={1} justify="end" align="end">
                <NoMarginParagraph color={colors.gray8} size={".65rem"}>
                    Doesn't seem right?
                </NoMarginParagraph>
                <Button
                    type="link"
                    onClick={requestAudit}
                    style={{
                        paddingRight: 0,
                        textDecoration: "underline",
                    }}
                >
                    <NoMarginParagraph color={colors.linkColor} size={".85rem"}>
                        Request Audit
                    </NoMarginParagraph>
                </Button>
            </Flex>
        </Row>
    );
}
