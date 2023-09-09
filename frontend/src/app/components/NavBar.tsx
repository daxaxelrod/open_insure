import React, { useMemo, useState } from "react";
import {
    Typography,
    Layout,
    Row,
    Button,
    Grid,
    MenuProps,
    Dropdown,
    Space,
    Col,
} from "antd";
import { Squeeze as Hamburger } from "hamburger-react";

import { useAppSelector } from "../../redux/hooks";
import { isLoggedIn } from "axios-jwt";
import { Link } from "react-router-dom";
import { HomeOutlined, FileOutlined, UserOutlined } from "@ant-design/icons";
import usePageTracking from "./hooks/usePageTracking";

const { Header } = Layout;

const { Title } = Typography;

export default function NavBar() {
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const [isOpen, setOpen] = useState(false);
    usePageTracking();

    const loggedIn = isLoggedIn();
    const sizes = Grid.useBreakpoint();

    const items: MenuProps["items"] = useMemo(
        () => [
            {
                label: <Link to={"/home"}>Home</Link>,
                icon: <HomeOutlined />,
                onClick: () => setOpen(false),
                key: "0",
            },
            {
                label: <Link to={"/policies"}>Policies</Link>,
                icon: <FileOutlined />,
                onClick: () => setOpen(false),
                key: "1",
            },

            {
                label: <Link to={"/me"}>Profile</Link>,
                icon: <UserOutlined />,
                onClick: () => setOpen(false),
                key: "3",
            },
        ],
        []
    );

    // use hamburger menu on mobile
    const isMedOrBelow = !sizes.lg && !sizes.xl && !sizes.xxl;

    return (
        <Header
            className="header"
            style={{
                paddingLeft: 0,
                paddingRight: 0,
                background: "#f0f2f5",
                paddingTop: 10,
                paddingBottom: 10,

                display: "flex",
            }}
        >
            <Row align="middle" justify="space-between" style={{ flex: 1 }}>
                <Col md={{ span: 18, offset: 0 }} lg={{ span: 12, offset: 3 }}>
                    {loggedIn && (
                        <Title level={4} style={{ margin: 0 }}>
                            &nbsp;Hi {currentUser?.first_name}
                        </Title>
                    )}

                    {isMedOrBelow && loggedIn ? (
                        <Dropdown
                            menu={{ items }}
                            trigger={["click"]}
                            onOpenChange={(open: boolean) => setOpen(open)}
                        >
                            <Space>
                                <Hamburger
                                    toggled={isOpen}
                                    toggle={setOpen}
                                    size={20}
                                />
                            </Space>
                        </Dropdown>
                    ) : (
                        <Link to="/">
                            <Title level={4} style={{ margin: 0 }}>
                                Open Insure&nbsp;
                            </Title>
                        </Link>
                    )}
                </Col>
                <Col lg={{ span: 6 }}>
                    {!loggedIn && (
                        <Link to={"/join"}>
                            <Button type="link">Register</Button>
                        </Link>
                    )}
                </Col>
            </Row>
        </Header>
    );
}
