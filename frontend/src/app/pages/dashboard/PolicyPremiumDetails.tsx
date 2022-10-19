import React, { useEffect } from "react";
import { Checkbox, Col, Row, Space, Table, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Policy, Risk, User } from "../../../redux/reducers/commonTypes";
import { ColumnsType } from "antd/lib/table";
import { getPolicyPremiums } from "../../../redux/actions/policies";
import moment from "moment-timezone";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { getHumanReadablePaymentFrequencyForPolicy } from "../../components/policies/utils/riskUtils";

const { Title } = Typography;

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
    const risks = useAppSelector((state) => state.risk.policyRisks?.[policyId]);

    const togglePremiumPaid = (paidValue: boolean, premiumId: number) => {
        console.log(paidValue, premiumId);
    };

    const columns: ColumnsType<PremiumRowType> = [
        {
            title: "Month Number",
            dataIndex: "monthNumber",
            key: "month_number",
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            render: (dueDate: string) => moment(dueDate).format("MMM Do, YYYY"),
            key: "dueDate",
        },
        ...(policy?.pod?.members?.map((user: User) => {
            return {
                title: () => {
                    const userPremium = risks?.find(
                        (r: Risk) => r.user === user?.id
                    )?.premium_amount;

                    return (
                        <div>
                            <div className="ant-table-thead">
                                {user.first_name} {user.last_name}
                            </div>
                            <div className="ant-table-thead">
                                ${(userPremium / 100).toFixed(2)} /{" "}
                                {getHumanReadablePaymentFrequencyForPolicy(
                                    policy
                                )}
                            </div>
                        </div>
                    );
                },

                render: (text: string, record: any) => {
                    let userSpecificInfo = record[user.id];
                    return userSpecificInfo ? (
                        <Checkbox
                            onChange={(e: CheckboxChangeEvent) =>
                                togglePremiumPaid(
                                    e.target.value,
                                    userSpecificInfo?.premiumId
                                )
                            }
                        >
                            {userSpecificInfo?.paid ? "Paid" : "Not Paid"}
                        </Checkbox>
                    ) : null;
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
                premiumId: premium.id,
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
                        scroll={{ x: "max-content" }}
                        columns={columns}
                        dataSource={tableData}
                        loading={getPolicyPremiumsPending}
                    />
                </Col>
            </Row>
        </div>
    );
}
