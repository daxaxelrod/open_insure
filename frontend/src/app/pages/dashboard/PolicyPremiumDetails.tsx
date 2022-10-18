import React, { useEffect } from "react";
import { Col, Row, Space, Table, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Policy, Premium, User } from "../../../redux/reducers/commonTypes";
import colors from "../../constants/colors";
import { ColumnsType } from "antd/lib/table";
import { getPolicyPremiums } from "../../../redux/actions/policies";
import moment from "moment-timezone";

const { Title, Paragraph } = Typography;

interface PremiumRowType {
    key: React.Key;
    monthNumber: number;
    dueDate: string;
}

export default function PolicyPremiumDetails() {
    let { id } = useParams();
    let policyId = parseInt(id || "");
    let dispatch = useAppDispatch();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p.id === policyId)
    );
    const getPolicyPremiumsPending = useAppSelector(
        (state) => state.policies.getPolicyPremiumsPending
    );

    const columns: ColumnsType<PremiumRowType> = [
        {
            title: "Month Number",
            dataIndex: "monthNumber",
            key: "month_number",
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
        },
        ...(policy?.pod?.members?.map((user: User) => {
            return {
                title: `${user.first_name} ${user.last_name}`,
                render: (text: string, record: any) => {
                    let userSpecificInfo = record[user.id];
                    return JSON.stringify(userSpecificInfo);
                },
                key: user.id,
            };
        }) || []),
    ];

    const premiumsByMonth = policy?.premiums?.reduce(
        (accumulator: Record<string, Record<number, any>>, premium) => {
            let data = {
                paid: premium.paid,
                amount: premium.amount,
                marked_paid_by: premium.marked_paid_by,
            };
            if (!accumulator[premium.due_date]) {
                accumulator[premium.due_date] = {
                    [premium.payer]: data,
                };
            } else {
                accumulator[premium.due_date][premium.payer] = data;
            }

            return accumulator;
        },
        {}
    );

    let tableData: PremiumRowType[] = [];
    if (premiumsByMonth) {
        let monthKeys = Object.keys(premiumsByMonth).sort(
            (a, b) => moment(a).unix() - moment(b).unix()
        );
        for (let index = 0; index < monthKeys.length; index++) {
            let rowData: PremiumRowType;
            const month = monthKeys[index];
            const premiumsByUser = premiumsByMonth[month];
            // const userKeys = Object.keys(premiumsByUser).map((userId: number) => {
            //     let premiumInfo = premiumsByUser[userId]
            //     return {
            //         user
            //     }
            //  });
            rowData = {
                key: index,
                monthNumber: index + 1,
                dueDate: month,
                ...premiumsByUser,
            };
            tableData.push(rowData);
        }
    }

    console.log({ tableData });

    useEffect(() => {
        dispatch(getPolicyPremiums(policyId));
    }, [policyId]);

    return (
        <div>
            <Row align="middle">
                <Col span={19}>
                    <Title level={2}>Premiums</Title>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        loading={getPolicyPremiumsPending}
                    />
                </Col>
            </Row>
        </div>
    );
}
