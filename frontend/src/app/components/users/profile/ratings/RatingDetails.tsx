import React from "react";
import { ReputationDetails } from "../../../../../redux/reducers/types/commonTypes";
import { Row, Space } from "antd";
import colors from "../../../../constants/colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { NoMarginParagraph } from "../../../common/CommonStyled";
dayjs.extend(relativeTime);

export default function RatingDetails({
    reputation,
}: {
    reputation: ReputationDetails | undefined;
}) {
    if (!reputation || !reputation?.components) return null;

    return (
        <Row>
            <Space size={"middle"}>
                <div>
                    <NoMarginParagraph color={colors.gray8} size={".65rem"}>
                        Calculated
                    </NoMarginParagraph>
                    <NoMarginParagraph color={colors.gray10}>
                        {dayjs(reputation.calculated_on).fromNow()}
                    </NoMarginParagraph>
                </div>
                <div>
                    <NoMarginParagraph color={colors.gray8} size={".65rem"}>
                        Next refresh
                    </NoMarginParagraph>
                    <NoMarginParagraph color={colors.gray10}>
                        {dayjs(reputation.next_refresh_available).fromNow()}
                    </NoMarginParagraph>
                </div>
            </Space>
        </Row>
    );
}
