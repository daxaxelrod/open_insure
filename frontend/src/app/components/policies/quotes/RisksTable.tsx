import React, { useEffect, useState } from "react";
import { getRisksForPolicy } from "../../../../redux/actions/risk";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    Policy,
    UnderlyingInsuredType,
    Risk,
    User,
} from "../../../../redux/reducers/commonTypes";
import {
    MobileOutlined,
    CustomerServiceOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Alert, Drawer, Image, Table, Tooltip, Typography } from "antd";
import { getHumanReadableCondition } from "../utils/riskUtils";
import { Link } from "react-router-dom";
import colors from "../../../constants/colors";
import { ConditionalWrapper } from "../../../utils/componentUtils";
import PolicyQuoteForm from "./PolicyQuoteForm";

interface RiskRowType extends Risk {
    key: React.Key;
}

const { Title } = Typography;

export function get_icon_for_insured_asset_type(
    type: UnderlyingInsuredType,
    withTooltip: boolean = true
) {
    const Wrapper = withTooltip ? Tooltip : "div"; // apparently 'div' is a valid react component, who knew it was just strings
    switch (type) {
        case "cell_phone":
            return (
                <Wrapper title="Cell phone" color="black">
                    <MobileOutlined style={{ fontSize: "1.6em" }} />
                </Wrapper>
            );
        case "audio_equipment":
            return (
                <Wrapper title="Audio Equipment" color="black">
                    <CustomerServiceOutlined style={{ fontSize: "1.6em" }} />
                </Wrapper>
            );
        default:
            return null;
    }
}

export default function RiskTable({ policy }: { policy: Policy }) {
    const dispatch = useAppDispatch();
    const policyRisks = useAppSelector((state) => state.risk.policyRisks);
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const focusedRisk = useAppSelector((state) => state.risk.focusedRisk);
    const [riskViewDrawerOpen, setRiskViewDrawerOpen] = useState(false);
    const [photoPreviewVisible, setPhotoPreviewVisible] = useState(false);

    useEffect(() => {
        if (policy?.id && policy.id in policyRisks === false) {
            dispatch(getRisksForPolicy(policy.id));
        }
    }, [policy]);

    let risks: RiskRowType[] =
        policyRisks?.[policy?.id]?.map((risk: Risk, index: number) => {
            return {
                ...risk,
                key: `risk-${risk.id}-${index}`,
            };
        }) || [];
    risks = risks.filter(
        (r) =>
            r?.premium_amount &&
            policy?.pod?.members?.some((m: User) => m.id === r.user)
    );

    const columns: ColumnsType<RiskRowType> = [
        {
            title: "Item",
            render: (text, record: RiskRowType) => {
                const isRiskOwnedByUser = record?.user === currentUser.id;
                return (
                    <div>
                        {record.content_object?.album?.[0]?.image ? (
                            <Image
                                onClick={() => setPhotoPreviewVisible(true)}
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 10,
                                    marginRight: 10,
                                }}
                                src={
                                    process.env.REACT_APP_BACKEND_URL +
                                    record.content_object?.album?.[0].image
                                }
                                alt={record.underlying_insured_type}
                            />
                        ) : null}
                        <ConditionalWrapper
                            condition={isRiskOwnedByUser}
                            wrapper={(children: any) => (
                                <>
                                    <Drawer
                                        title={"My Data"}
                                        placement="right"
                                        onClose={() =>
                                            setRiskViewDrawerOpen(false)
                                        }
                                        width={"45%"}
                                        visible={riskViewDrawerOpen}
                                        bodyStyle={{ paddingBottom: 80 }}
                                    >
                                        <Alert
                                            message="Once you've joined a policy, you can't
                                        edit your covered item. Speak with an
                                        admin if you need to make changes."
                                            type="warning"
                                            showIcon
                                            icon={
                                                <WarningOutlined
                                                    style={{
                                                        color: colors.warning1,
                                                    }}
                                                />
                                            }
                                            style={{ marginBottom: "1.5rem" }}
                                        />
                                        <PolicyQuoteForm
                                            editable={false}
                                            policy={policy}
                                            risk={focusedRisk}
                                            closeDrawer={() =>
                                                setRiskViewDrawerOpen(false)
                                            }
                                        />
                                    </Drawer>
                                    <span
                                        style={{
                                            textDecoration: "underline",
                                            color: "#1a0dab",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setRiskViewDrawerOpen(true);
                                        }}
                                    >
                                        {children}
                                    </span>
                                </>
                            )}
                        >
                            {isRiskOwnedByUser ? "My " : ""}
                            {record.content_object?.model}
                        </ConditionalWrapper>
                    </div>
                );
            },
            dataIndex: "model",
            key: "model",
        },
        {
            title: "Premium",
            render: (text) => (
                <Title level={5}>${(text / 100).toFixed(2)}</Title>
            ),
            dataIndex: "premium_amount",
            key: "premium_amount",
        },
        {
            title: "Make",
            render: (text, record: RiskRowType) => record.content_object?.make,
            key: "make",
        },
        {
            title: "Market Value",
            render: (text, record: RiskRowType) =>
                `$${record.content_object?.market_value}`,
            key: "market_value",
        },

        {
            title: "Type",
            render: (text, record: RiskRowType) =>
                get_icon_for_insured_asset_type(record.underlying_insured_type),
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Condition",
            render: (text, record: RiskRowType) =>
                getHumanReadableCondition(record.content_object?.condition),
            dataIndex: "condition",
            key: "condition",
        },
        {
            title: "Member",
            render: (text, record: Risk) => {
                const user = policy.pod.members.find(
                    (member) => member.id === record.user
                );
                if (user) {
                    const userName = user?.first_name + " " + user?.last_name;
                    return (
                        <Link to={`/members/${record.user}`}>{userName}</Link>
                    );
                } else {
                    return (
                        <div>
                            <WarningOutlined
                                style={{
                                    marginRight: 4,
                                    color: colors.warning1,
                                }}
                            />
                            <i>Not found</i>
                        </div>
                    );
                }
            },
            dataIndex: "member",
            key: "member_name",
        },
    ];
    return (
        <div style={{ marginBottom: "1rem" }}>
            <Title level={4}>Covered Items</Title>
            <Table dataSource={risks} columns={columns} />
        </div>
    );
}
