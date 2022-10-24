import React, { useEffect, useState } from "react";
import {
    Checkbox,
    Col,
    notification,
    Popconfirm,
    Table,
    Row,
    Spin,
    Tooltip,
    Typography,
} from "antd";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    Policy,
    Premium,
    Risk,
    User,
} from "../../../../redux/reducers/commonTypes";
import { ColumnsType } from "antd/lib/table";
import moment from "moment-timezone";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { getHumanReadablePaymentFrequencyForPolicy } from "../utils/riskUtils";
import colors from "../../../constants/colors";
import {
    getPolicyPremiums,
    patchPremium,
} from "../../../../redux/actions/premiums";

import "../../../styles/dashboard/PolicyPremiumDetails.css";

const { Title, Paragraph } = Typography;

interface PremiumRowType {
    key: React.Key;
    monthNumber: number;
    dueDate: string;
}

export default function PolicyPremiums() {
    let { id } = useParams();
    let policyId = parseInt(id || "");
    let dispatch = useAppDispatch();
    let [isUnpaidWarningOpen, setIsUnpaidWarningOpen] = useState(false);
    let [localFocusedPremiumId, setLocalFocusedPremiumId] =
        useState<number>(-1);
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p.id === policyId)
    );
    let currentUser = useAppSelector((state) => state.auth.currentUser);
    const getPolicyPremiumsPending = useAppSelector(
        (state) => state.premiums.getPolicyPremiumsPending
    );
    const risks = useAppSelector((state) => state.risk.policyRisks?.[policyId]);

    const togglePremiumPaid = (paidValue: boolean, premiumId: number) => {
        if (isMember) {
            if (!paidValue) {
                setLocalFocusedPremiumId(premiumId);
                setIsUnpaidWarningOpen(true);
            } else {
                dispatch(
                    patchPremium(policyId, premiumId, { paid: paidValue })
                );
            }
        } else {
            notification.warn({
                message: "Only policy members can modify premiums",
                placement: "top",
            });
        }
    };

    const confirmPopover = () => {
        if (localFocusedPremiumId !== -1) {
            setIsUnpaidWarningOpen(false);
            dispatch(
                patchPremium(policyId, localFocusedPremiumId, { paid: false })
            );
            setLocalFocusedPremiumId(-1);
        }
    };

    const closePopover = () => {
        setIsUnpaidWarningOpen(false);
        setLocalFocusedPremiumId(-1);
    };

    const premiums = useAppSelector(
        (state) => state.premiums.premiums?.[policyId]
    );

    const pendingPremiums = useAppSelector(
        (state) => state.premiums.pendingPremiums
    );

    let isMember =
        currentUser.id !== undefined &&
        policy?.pod &&
        policy?.pod.members?.some((m: User) => m.id === currentUser.id);

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
        ...(policy?.pod?.members
            ?.filter((member: User) => {
                // filter out users who dont have risks
                return (
                    risks?.find((r: Risk) => r.user === member?.id)
                        ?.premium_amount !== undefined
                );
            })
            ?.map((user: User) => {
                return {
                    title: () => {
                        const userPremium =
                            risks?.find((r: Risk) => r.user === user?.id)
                                ?.premium_amount || 0;

                        const totalPaid = premiums
                            ?.filter((premium: Premium) => {
                                return (
                                    premium.payer === user.id && premium.paid
                                );
                            })
                            ?.reduce((sum: number, premium: Premium) => {
                                return sum + premium.amount;
                            }, 0);

                        return (
                            <div>
                                <div className="ant-table-thead">
                                    {user.first_name} {user.last_name}
                                </div>
                                <div className="ant-table-thead">
                                    ${(totalPaid / 100).toFixed(2)} Paid total
                                </div>
                                <div className="ant-table-thead">
                                    ${(userPremium / 100).toFixed(2)}&nbsp;
                                    {getHumanReadablePaymentFrequencyForPolicy(
                                        policy
                                    )}
                                </div>
                            </div>
                        );
                    },

                    render: (text: string, record: any) => {
                        let userSpecificInfo = record[user.id];
                        let isPremiumPastDue = moment().isAfter(
                            moment(record.dueDate)
                        );
                        let accountingUser = policy?.pod?.members?.find(
                            (user: User) =>
                                user.id === userSpecificInfo?.marked_paid_by
                        );
                        let isPending = userSpecificInfo?.pending;

                        return userSpecificInfo ? (
                            isPending ? (
                                <Spin />
                            ) : (
                                <Popconfirm
                                    title="Are you sure you want to mark this as unpaid?"
                                    disabled={!isUnpaidWarningOpen}
                                    onConfirm={confirmPopover}
                                    onCancel={closePopover}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Checkbox
                                        onChange={(e: CheckboxChangeEvent) =>
                                            togglePremiumPaid(
                                                e.target.checked,
                                                userSpecificInfo?.premiumId
                                            )
                                        }
                                        checked={userSpecificInfo?.paid}
                                    >
                                        {userSpecificInfo?.paid ? (
                                            <Tooltip
                                                trigger={"hover"}
                                                title={`Marked Paid by ${
                                                    accountingUser?.first_name
                                                        ? `${accountingUser?.first_name} ${accountingUser?.last_name}`
                                                        : "an admin user, don't know who"
                                                } on ${moment(
                                                    userSpecificInfo?.paid_date
                                                ).format("MMMM Do, YYYY")}`}
                                                color="black"
                                            >
                                                <span className="premium-paid-link-tooltip-text">
                                                    Paid
                                                </span>
                                            </Tooltip>
                                        ) : isPremiumPastDue ? (
                                            <span
                                                style={{ color: colors.alert1 }}
                                            >
                                                Overdue
                                            </span>
                                        ) : (
                                            "Not paid"
                                        )}
                                    </Checkbox>
                                </Popconfirm>
                            )
                        ) : null;
                    },
                    key: user.id,
                };
            }) || []),
    ];

    const premiumsByMonth = premiums?.reduce(
        (
            accumulator: Record<string, Record<number, any>>,
            premium: Premium
        ) => {
            let data = {
                paid: premium.paid,
                amount: premium.amount,
                marked_paid_by: premium.marked_paid_by,
                paid_date: premium.paid_date,
                premiumId: premium.id,
                pending: pendingPremiums[premium.id],
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

    useEffect(() => {
        if (policyId) {
            dispatch(getPolicyPremiums(policyId));
        }
    }, [policyId]);

    return (
        <div>
            <Row align="middle">
                <Col span={19}>
                    <Title level={4}>Premiums</Title>
                    <Paragraph style={{ color: colors.gray9 }}>
                        Hover <span style={{ fontWeight: 800 }}>bold</span>{" "}
                        columns for more information
                    </Paragraph>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        // summary={(pageData: any) => {
                        //     console.log({ pageData });

                        //     return <div>total</div>;
                        // }}
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
