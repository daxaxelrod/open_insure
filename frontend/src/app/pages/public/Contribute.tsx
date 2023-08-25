import React, { useState } from "react";
import OpenInsureFooter from "../../components/home/Footer";
import { Col, Grid, Row } from "antd";
import AssetGuessForm from "../../components/users/guesses/AssetGuessForm";
import PolicyLineStats from "../../components/users/guesses/stats/PolicyLineStats";

export default function Contribute() {
    const screens = Grid.useBreakpoint();
    const [atSecondStep, setAtSecondStep] = useState(false);

    const isMobile = !screens.lg;

    return (
        <div>
            <Row>
                <Col
                    md={{ span: 16 }}
                    lg={{ span: 11 }}
                    style={{
                        padding: 24,
                    }}
                >
                    <AssetGuessForm setAtSecondStep={setAtSecondStep} />
                </Col>
                <Col
                    md={{
                        span: 8,
                    }}
                    lg={{
                        span: 13,
                    }}
                    style={{
                        backgroundColor: "white",
                        padding: 24,
                    }}
                >
                    <PolicyLineStats isOnSecondStep={atSecondStep} />
                </Col>
            </Row>
            <OpenInsureFooter key="footer" />
        </div>
    );
}
