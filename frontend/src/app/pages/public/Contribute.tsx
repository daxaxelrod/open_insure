import React, { useState } from "react";
import OpenInsureFooter from "../../components/home/Footer";
import { Col, Grid, Row } from "antd";
import AssetGuessForm from "../../components/users/guesses/AssetGuessForm";
import PolicyLineStats from "../../components/users/guesses/stats/PolicyLineStats";

export default function Contribute() {
    const [atSecondStep, setAtSecondStep] = useState(false);
    const grid = Grid.useBreakpoint();

    const isMdOrBelow = window.innerWidth < 992 || (grid.md && !grid.lg);

    return (
        <div>
            <Row
                style={{
                    padding: isMdOrBelow ? "1rem" : "2rem",
                    ...(isMdOrBelow ? { minHeight: "75vh" } : {}),
                }}
            >
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
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
