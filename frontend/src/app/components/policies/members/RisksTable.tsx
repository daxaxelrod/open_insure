import React, { useEffect, useState } from "react";
import { getRisksForPolicy } from "../../../../redux/actions/risk";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    Policy,
    UnderlyingInsuredType,
    Risk,
} from "../../../../redux/reducers/commonTypes";
import { MobileOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Image, Table, Tooltip, Typography } from "antd";

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
            render: (text, record: RiskRowType) => record.content_object.model,
            dataIndex: "model",
            key: "model",
        },
        {
            title: "Premium",
            render: (text) => <Title level={3}>${text / 100}</Title>,
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
                record.content_object.market_value,
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
            render: (text) => text,
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Picture",
            render: (text, record) => (
                <>
                    <Image
                        onClick={() => setPhotoPreviewVisible(true)}
                        style={{ height: 40, width: 40, borderRadius: 10 }}
                        src={"https://picsum.photos/200/300"}
                        alt={record.underlying_insured_type}
                    />
                    {/* <div style={{ display: "none" }}>
                        <Image.PreviewGroup
                            preview={{
                                visible: photoPreviewVisible,
                                onVisibleChange: (vis) => {
                                    console.log(vis);
                                    setPhotoPreviewVisible(vis);
                                },
                                closeIcon: <div>Close</div>,
                            }}
                        >
                            <Image src="https://picsum.photos/200/300" />
                            <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
                            <Image src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp" />
                            <Image src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp" />
                        </Image.PreviewGroup>
                    </div> */}
                </>
            ),
            dataIndex: "name",
            key: "name",
        },
    ];
    return (
        <>
            <Title>Whos in it</Title>
            <Table dataSource={risks} columns={columns} />
        </>
    );
}
