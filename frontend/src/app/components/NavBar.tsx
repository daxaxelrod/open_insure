import React from "react";
import { Typography, Layout, Row } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { isLoggedIn } from "axios-jwt";
const { Header } = Layout;

const { Title } = Typography;

export default function NavBar() {
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const loggedIn = isLoggedIn();

    return (
        <Header
            className="header"
            style={{
                background: "#f0f2f5",
                paddingTop: 10,
                paddingBottom: 10,
                display: "flex",
                flex: 1,
            }}
        >
            <Row
                align="middle"
                justify={loggedIn ? "space-between" : "start"}
                style={{ flex: 1 }}
            >
                {loggedIn && (
                    <Title level={4} style={{ margin: 0 }}>
                        &nbsp;Hi {currentUser?.first_name}
                    </Title>
                )}

                <a href="/">
                    <Title level={4} style={{ margin: 0 }}>
                        Open Insure&nbsp;
                    </Title>
                </a>
            </Row>
        </Header>
    );
}
