import React, { useMemo, useState } from "react";
import {
    Typography,
    Layout,
    Row,
    Button,
    Grid,
    MenuProps,
    Dropdown,
    Col,
} from "antd";
import { Squeeze as Hamburger } from "hamburger-react";

import { useAppSelector } from "../../redux/hooks";
import { isLoggedIn } from "axios-jwt";
import { Link } from "react-router-dom";
import { HomeOutlined, FileOutlined, UserOutlined } from "@ant-design/icons";
import usePageTracking from "./hooks/usePageTracking";
import useWindowScrollPosition from "./hooks/useWindowScrollPosition";

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

    const scrollPosition = useWindowScrollPosition();
    const hasScrolled = useMemo(
        () => scrollPosition.scrollY > 0,
        [scrollPosition.scrollY]
    );

    return (
        <Header
            className={`main-header header ${
                hasScrolled ? "nav-scrolled" : ""
            }`}
            style={{
                paddingLeft: 0,
                paddingRight: 0,
                background: "white",
                height: "100%",
                paddingTop: 10,
                paddingBottom: 10,
            }}
        >
            <Row align="middle">
                <Col
                    xxl={{ span: 14, offset: 3 }}
                    xl={{ span: 14, offset: 3 }}
                    lg={{ span: 15, offset: 2 }}
                    md={{ span: 14, offset: 2 }}
                    sm={{ span: 13, offset: 2 }}
                    xs={{ span: 13, offset: 2 }}
                >
                    {isMedOrBelow && loggedIn ? (
                        <Dropdown
                            menu={{ items }}
                            trigger={["click"]}
                            onOpenChange={(open: boolean) => setOpen(open)}
                        >
                            <div style={{ position: "relative" }}>
                                <Hamburger
                                    toggled={isOpen}
                                    toggle={setOpen}
                                    size={20}
                                />
                            </div>
                        </Dropdown>
                    ) : !loggedIn ? (
                        <Link to="/">
                            <Title level={4} style={{ margin: 0 }}>
                                Open Insure&nbsp;
                            </Title>
                        </Link>
                    ) : (
                        <Title level={4} style={{ margin: 0 }}>
                            &nbsp;Hi {currentUser?.first_name}
                        </Title>
                    )}
                </Col>
                {!loggedIn && (
                    <Col
                        xs={{ span: 6 }}
                        sm={{ span: 6 }}
                        md={{ span: 6 }}
                        lg={{ span: 4 }}
                        style={{ textAlign: "right" }}
                    >
                        <Link to={"/join"}>
                            <Button type="link">Register</Button>
                        </Link>
                        <Link to={"/login"}>
                            <Button type="link">Login</Button>
                        </Link>
                    </Col>
                )}
            </Row>
        </Header>
    );
}
