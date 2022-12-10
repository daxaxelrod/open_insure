import { Col, Image, Row } from "antd";
import React from "react";
import securityOnRe from "../../../assets/images/undraw_security_on_re_e491.svg";
import traditional_companies_sankey from "../../../assets/images/home/traditional_companies_sankey.svg";
import open_insure_sankey from "../../../assets/images/home/open_insure_sankey.svg";

export default function WhyDoSelfInsurance() {
    return (
        <Row style={{ backgroundColor: "white" }}>
            <Col md={12} lg={{ span: 8, offset: 4 }}>
                <h1>Insurance companies only make money from your premiums</h1>
                <img
                    src={traditional_companies_sankey}
                    style={{ width: "100%" }}
                    alt="Image one"
                />
            </Col>
            <Col md={12} lg={12}>
                <img src={open_insure_sankey} style={{ width: "100%" }} />
            </Col>
        </Row>
    );
}
