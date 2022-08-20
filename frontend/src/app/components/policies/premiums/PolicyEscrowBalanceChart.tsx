import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { ReactComponent } from "../../../../assets/images/policy-detail/undraw_visual_data_re_mxxo.svg";
import { Col, Row } from "antd";

export default function PolicyEscrowBalanceChart({
    policy,
    isMember,
}: {
    policy: Policy;
    isMember?: boolean;
}) {
    return (
        <Row justify="center">
            <Col>
                <ReactComponent style={{ height: "100%", width: 140 }} />
                <div style={{ textAlign: "center" }}>
                    Escrow Balance not reported
                </div>
            </Col>
        </Row>
    );
}
