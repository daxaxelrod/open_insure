import React from "react";
import { Typography, Layout, Row, Button } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { isLoggedIn } from "axios-jwt";
import { Link } from "react-router-dom";
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
            }}
        >
            <Row align="middle" justify="space-between" style={{ flex: 1 }}>
                {loggedIn && (
                    <Title level={4} style={{ margin: 0 }}>
                        &nbsp;Hi {currentUser?.first_name}
                    </Title>
                )}

                <Link to="/">
                    <Title level={4} style={{ margin: 0 }}>
                        Open Insure&nbsp;
                    </Title>
                </Link>
                {!loggedIn && (
                    <Link to={"/login"}>
                        <Button type="link">Login</Button>
                    </Link>
                )}
            </Row>
        </Header>
    );
}
