import React, { useEffect, useState } from "react";
import { getRisksForPolicy } from "../../../../redux/actions/risk";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    Policy,
    UnderlyingInsuredType,
    Risk,
} from "../../../../redux/reducers/commonTypes";
import {
    MobileOutlined,
    CustomerServiceOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Image, Table, Tooltip, Typography } from "antd";
import { getHumanReadableCondition } from "../utils/riskUtils";
import { Link } from "react-router-dom";
import colors from "../../../constants/colors";

interface RiskRowType extends Risk {
    key: React.Key;
}

const { Title } = Typography;

function get_icon_for_insured_asset_type(type: UnderlyingInsuredType) {
    switch (type) {
        case "cell_phone":
            return (
                <Tooltip title="Cell phone">
                    <MobileOutlined style={{ fontSize: "1.6em" }} />
                </Tooltip>
            );
        case "audio_equipment":
            return (
                <Tooltip title="Audio Equipment">
                    <CustomerServiceOutlined style={{ fontSize: "1.6em" }} />
                </Tooltip>
            );
        default:
            return null;
    }
}

export default function RiskTable({ policy }: { policy: Policy }) {
    const dispatch = useAppDispatch();
    const policyRisks = useAppSelector((state) => state.risk.policyRisks);
    const [photoPreviewVisible, setPhotoPreviewVisible] = useState(false);

    useEffect(() => {
        if (policy?.id && policy.id in policyRisks === false) {
            dispatch(getRisksForPolicy(policy.id));
        }
    }, [policy]);

    let risks: RiskRowType[] = policyRisks?.[policy?.id] || [];
    risks = risks.filter((r) => r?.premium_amount);

    const columns: ColumnsType<RiskRowType> = [
        {
            title: "Item",
            render: (text, record: RiskRowType) => {
                return (
                    <div>
                        {record.content_object.model}
                        {record.content_object.album?.[0].image ? (
                            <Image
                                onClick={() => setPhotoPreviewVisible(true)}
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 10,
                                }}
                                src={record.content_object.album?.[0].image}
                                alt={record.underlying_insured_type}
                            />
                        ) : null}
                    </div>
                );
            },
            dataIndex: "model",
            key: "model",
        },
        {
            title: "Premium",
            render: (text) => <Title level={5}>${text / 100}</Title>,
            dataIndex: "premium_amount",
            key: "premium_amount",
        },
        {
            title: "Make",
            render: (text, record: RiskRowType) => record.content_object.make,
            key: "make",
        },
        {
            title: "Market Value",
            render: (text, record: RiskRowType) =>
                `$${record.content_object.market_value}`,
            key: "market_value",
        },

        {
            title: "Type",
            render: (text, record: RiskRowType) =>
                get_icon_for_insured_asset_type(record.underlying_insured_type),
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Condition",
            render: (text, record: RiskRowType) =>
                getHumanReadableCondition(record.content_object.condition),
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
            dataIndex: "name",
            key: "name",
        },
    ];
    return (
        <>
            <Title level={4}>Covered Items</Title>
            <Table dataSource={risks} columns={columns} />
        </>
    );
}
