import React from "react";
import { Policy } from "../../../redux/reducers/commonTypes";
import type { BadgeProps } from "antd";
import { Badge, Calendar, Typography } from "antd";
import moment from "moment-timezone";
import type { Moment } from "moment";
import { PresetStatusColorType } from "antd/lib/_util/colors";
import { useAppSelector } from "../../../redux/hooks";

const { Title } = Typography;
interface CalendarItem {
    type: PresetStatusColorType;
    content: string;
}

export default function UserPolicyCalendar({
    policies,
}: {
    policies: Policy[];
}) {
    // Displays
    // policy start/end dates,
    // Premium due dates
    // claim response deadlines
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    const getListData = (value: Moment) => {
        let listData: CalendarItem[] = [];
        policies.forEach((policy) => {
            // Policy start/end dates
            if (moment(policy.coverage_start_date).isSame(value)) {
                listData.push({
                    type: "success",
                    content: `${policy.name} starts`,
                });
            }

            // Premium due dates
            policy.premiums.forEach((premium) => {
                if (
                    moment(premium.due_date).isSame(value) &&
                    premium.payer === currentUser.id
                ) {
                    if (premium.paid) {
                        listData.push({
                            type: "success",
                            content: `${policy.name} premium paid`,
                        });
                    } else {
                        listData.push({
                            type: "warning",
                            content: `${policy.name} premium due`,
                        });
                    }
                }
            });
        });
        return listData || [];
    };

    const dateCellRender = (value: Moment) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge
                            status={item.type as BadgeProps["status"]}
                            text={item.content}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    const headerRender = () => null; // todo

    return (
        <div>
            <Title level={3}>Scheduled Premiums</Title>
            <Calendar
                dateCellRender={dateCellRender}
                fullscreen={false}
                headerRender={headerRender}
            />
        </div>
    );
}
