import React from "react";
import OpenInsureFooter from "../../components/home/Footer";
import { Col, Grid, Row } from "antd";
import AssetGuessForm from "../../components/users/guesses/AssetGuessForm";
import AssetGuessDisplay from "../../components/users/guesses/AssetGuessDisplay";

export default function Contribute() {
    const screens = Grid.useBreakpoint();

    const isMobile = !screens.lg;

    return (
        <div>
            <Row>
                <Col
                    md={{ span: 6 }}
                    lg={{ span: 8 }}
                    style={{
                        padding: 24,
                    }}
                >
                    <AssetGuessForm />
                </Col>
                <Col
                    md={{
                        span: 18,
                    }}
                    lg={{
                        span: 16,
                    }}
                    style={{
                        backgroundColor: "white",
                        padding: 24,
                    }}
                >
                    <AssetGuessDisplay />
                </Col>
            </Row>
            <OpenInsureFooter key="footer" />
        </div>
    );
}
