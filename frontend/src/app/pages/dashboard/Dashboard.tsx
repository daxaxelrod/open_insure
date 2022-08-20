import { getAccessToken, isLoggedIn } from "axios-jwt";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    UserOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb } from "antd";
import "../../styles/dashboard/main.css";
import { getAvailablePolicies } from "../../../redux/actions/policies";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

const { Header, Sider, Content } = Layout;

// function getPageNameFromLocation(path: string) {
//     return [

//     ]
// }

export default function Home(props: any) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [pageTitle, setPageTitle] = useState("Find Policies");
    const pageNum = useAppSelector(
        (state) => state.policies.nextPublicPoliciesPage
    );
    const dispatch = useAppDispatch();
    const accessToken = getAccessToken();
    const location = useLocation();

    // useEffect(() => {
    //     console.log("location", location.pathname);
    //     let pageComponents = getPageNameFromLocation(location.pathname)
    //     setPageTitle(pageComponents)
    // }, [location]);

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/join");
        } else {
            // hrm, do this here and its better for user experience, gets to see data faster
            // but do it in the sub component and it makes more sense code wise.
            dispatch(getAvailablePolicies(pageNum || 1, 10));
            if (location.pathname === "/") {
                navigate("/home");
            }
        }
    }, [accessToken, pageNum]);

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <SearchOutlined />,
                            label: (
                                <Link
                                    to={"/home"}
                                    onClick={() => {
                                        setPageTitle("Find Policies");
                                    }}
                                >
                                    Browse
                                </Link>
                            ),
                        },
                        {
                            key: "2",
                            icon: <HomeOutlined />,
                            label: (
                                <Link
                                    to={"policies"}
                                    onClick={() => {
                                        setPageTitle("My Policies");
                                    }}
                                >
                                    My policies
                                </Link>
                            ),
                        },
                        {
                            key: "3",
                            icon: <UserOutlined />,
                            label: (
                                <Link
                                    to={"me"}
                                    onClick={() => {
                                        setPageTitle("My Profile");
                                    }}
                                >
                                    Profile
                                </Link>
                            ),
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{ padding: 0 }}
                >
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            className: "trigger",
                            onClick: () => setCollapsed(!collapsed),
                        }
                    )}
                    {pageTitle}
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
