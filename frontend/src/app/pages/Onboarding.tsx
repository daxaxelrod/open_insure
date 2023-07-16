import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Col, Row, Typography, Grid } from "antd";

import { Wizard } from "react-use-wizard";
import EmailPassOnboardingStep from "../components/onboarding/EmailPassOnboardingStep";
import { getInviteDataFromToken } from "../../networking/pods";
import PublicInviteTokenBanner from "../components/onboarding/PublicInviteTokenBanner";

const { Title, Paragraph } = Typography;

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Onboarding() {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    const [inviteData, setInviteData] = useState();

    let query = useQuery();
    const inviteToken = query.get("invite_token"); // todo: use this to prefill email and also allow to join to linked policy

    useEffect(() => {
        if (inviteToken) {
            (async () => {
                const response = await getInviteDataFromToken(inviteToken);
                if (response.status === 200) {
                    setInviteData(response.data);
                }
            })();
        }
    }, [inviteToken]);

    return (
        <div style={{ padding: 24 }}>
            <Row>
                <Col
                    lg={{ span: 6 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                >
                    <Title
                        level={2}
                        style={{ textAlign: isMobile ? "center" : "start" }}
                    >
                        Register
                    </Title>
                </Col>
                <Col
                    lg={{ span: 10 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                >
                    {inviteData ? (
                        <Row>
                            <Col
                                lg={{ span: 19, offset: 5 }}
                                md={{ span: 24 }}
                                sm={{ span: 24 }}
                                xs={{ span: 24 }}
                            >
                                <PublicInviteTokenBanner
                                    inviteData={inviteData}
                                />
                            </Col>
                        </Row>
                    ) : null}
                    <Wizard>
                        <EmailPassOnboardingStep />
                    </Wizard>
                </Col>
            </Row>
            <Paragraph>
                Already have an account? <Link to={"/login"}>Log in</Link>
            </Paragraph>
        </div>
    );
}
