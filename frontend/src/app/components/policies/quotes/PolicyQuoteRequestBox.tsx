import { Col, Row, Space } from "antd";
import React, { useState } from "react";
import { Button, Drawer, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getOrCreateRisk } from "../../../../redux/actions/risk";
import PolicyQuoteForm from "./PolicyQuoteForm";

const { Paragraph } = Typography;

export default function PolicyQuoteRequestBox({ policy }: { policy: Policy }) {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const dispatch = useAppDispatch();
    const focusedRisk = useAppSelector((state) => state.risk.focusedRisk);

    const showDrawer = () => {
        setIsDrawerVisible(true);
        dispatch(getOrCreateRisk(policy.id, {}));
    };

    const onClose = () => {
        setIsDrawerVisible(false);
    };

    return (
        <div>
            <Drawer
                title="Get a quote"
                placement="right"
                onClose={onClose}
                width={"40%"}
                visible={isDrawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <PolicyQuoteForm
                    policy={policy}
                    risk={focusedRisk}
                    closeDrawer={onClose}
                />
            </Drawer>
            <Button type="primary" onClick={showDrawer}>
                <Paragraph style={{ color: "white" }}>Get a quote</Paragraph>
            </Button>
        </div>
    );
}
