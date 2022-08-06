import { Col, Row } from "antd";
import React, { useState } from "react";
import { Button, Drawer, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import PolicyQuoteFormFactory from "./PolicyQuoteFormFactory";
import { useAppDispatch } from "../../../../redux/hooks";

const { Title, Paragraph } = Typography;

export default function PolicyQuoteRequestBox({ policy }: { policy: Policy }) {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const dispatch = useAppDispatch();

    const showDrawer = () => {
        setIsDrawerVisible(true);
        dispatch(getOrCreateActiveQuote(policy.id));
    };

    const onClose = () => {
        setIsDrawerVisible(false);
    };

    return (
        <div>
        <Drawer title="Get a quote" placement="right" onClose={onClose} visible={isDrawerVisible}>
            <PolicyQuoteFormFactory policy={policy} />
        </Drawer>
        <Button type="primary" onClick={showDrawer}>
            <Paragraph>Get a quote</Paragraph>
        </Button>
        </div>

        
        <div>
            <Row>
                <Col>
                </Col>
            </Row>
        </div>
    );
}
