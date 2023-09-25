import React, { useState } from "react";
import OpenInsureFooter from "../../components/home/Footer";
import { Col, Row } from "antd";
import AssetGuessForm from "../../components/users/guesses/AssetGuessForm";
import PolicyLineStats from "../../components/users/guesses/stats/PolicyLineStats";

export default function Contribute() {
    const [atSecondStep, setAtSecondStep] = useState(false);

    const isMdOrBelow = window.innerWidth < 992;

    return (
        <div>
            <Row
                style={{
                    padding: isMdOrBelow ? "1rem" : "2rem",
                }}
            >
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 16 }}
                    lg={{ span: 11 }}
                    xl={{ span: 11 }}
                >
                    <AssetGuessForm setAtSecondStep={setAtSecondStep} />
                </Col>

                {!isMdOrBelow ? (
                    <Col
                        md={{
                            span: 8,
                        }}
                        lg={{
                            span: 13,
                        }}
                        xl={{
                            span: 13,
                        }}
                    >
                        <PolicyLineStats isOnSecondStep={atSecondStep} />
                    </Col>
                ) : null}
            </Row>
            <OpenInsureFooter key="footer" />
        </div>
    );
}
