import React, { useState } from "react";
import {
    Typography,
    Layout,
    Row,
    Button,
    Grid,
    MenuProps,
    Dropdown,
    Space,
} from "antd";
import { Squeeze as Hamburger } from "hamburger-react";

import { useAppSelector } from "../../redux/hooks";
import { isLoggedIn } from "axios-jwt";
import { Link } from "react-router-dom";
import { HomeOutlined, FileOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const { Title } = Typography;

const items: MenuProps["items"] = [
    {
        label: <Link to={"/home"}>Home</Link>,
        icon: <HomeOutlined />,
        key: "0",
    },
    {
        label: <Link to={"/policies"}>Policies</Link>,
        icon: <FileOutlined />,
        key: "1",
    },

    {
        label: <Link to={"/me"}>Profile</Link>,
        icon: <UserOutlined />,
        key: "3",
    },
    {
        type: "divider",
    },
    {
        label: "Logout",
        key: "4",
    },
];

export default function NavBar() {
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const [isOpen, setOpen] = useState(false);

    const loggedIn = isLoggedIn();
    const sizes = Grid.useBreakpoint();

    // use hamburger menu on mobile
    const isMedOrBelow = !sizes.lg && !sizes.xl && !sizes.xxl;

    return (
        <Header
            className="header"
            style={{
                background: "#f0f2f5",
                paddingTop: 10,
                paddingBottom: 10,
                paddingInline: 30,
                display: "flex",
            }}
        >
            <Row align="middle" justify="space-between" style={{ flex: 1 }}>
                {loggedIn && (
                    <Title level={4} style={{ margin: 0 }}>
                        &nbsp;Hi {currentUser?.first_name}
                    </Title>
                )}

                {isMedOrBelow ? (
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

                {!loggedIn && (
                    <Link to={"/login"}>
                        <Button type="link">Login</Button>
                    </Link>
                )}
            </Row>
        </Header>
    );
}
