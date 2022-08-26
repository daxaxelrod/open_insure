import { Col, Row, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Drawer, Typography } from "antd";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getOrCreateRisk } from "../../../../redux/actions/risk";
import PolicyQuoteForm from "./PolicyQuoteForm";

const { Paragraph } = Typography;
type props = { policy: Policy };

const PolicyQuoteRequestBox = forwardRef(({ policy }: props, ref) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const dispatch = useAppDispatch();
    const focusedRisk: Risk = useAppSelector((state) => state.risk.focusedRisk);

    const showDrawer = () => {
        setIsDrawerVisible(true);
        dispatch(getOrCreateRisk(policy.id, {}));
    };

    const onClose = () => {
        setIsDrawerVisible(false);
    };

    let title = focusedRisk?.premium_amount ? "Modify Quote" : "Get a quote";

    useImperativeHandle(ref, () => ({
        open() {
            showDrawer();
        },
    }));

    return (
        <div>
            <Drawer
                title={title}
                placement="right"
                onClose={onClose}
                width={"45%"}
                visible={isDrawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <PolicyQuoteForm
                    policy={policy}
                    risk={focusedRisk}
                    closeDrawer={onClose}
                />
            </Drawer>
            <Button
                type={focusedRisk?.premium_amount ? "default" : "primary"}
                onClick={showDrawer}
            >
                <Paragraph
                    style={{
                        color: focusedRisk?.premium_amount ? "black" : "white",
                    }}
                >
                    {title}
                </Paragraph>
            </Button>
        </div>
    );
});

export interface PolicyQuoteRequestBoxRefType
    extends React.ForwardRefExoticComponent<
        props & React.RefAttributes<HTMLInputElement>
    > {
    open: () => void;
}

export default PolicyQuoteRequestBox;
