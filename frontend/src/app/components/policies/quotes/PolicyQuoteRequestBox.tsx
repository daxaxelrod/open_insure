import { Col, Row } from "antd";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";

export default function PolicyQuoteRequestBox({ policy }: { policy: Policy }) {
    return (
        <div>
            <Row>
                <Col>
                    <PolicyQuoteFormFactory policy={policy} />
                </Col>
            </Row>
            PolicyQuoteRequestForm
        </div>
    );
}
