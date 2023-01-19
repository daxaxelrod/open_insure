import React, { useState } from "react";
import { Col, Row, Button, Typography, Tooltip } from "antd";
import "../styles/dashboard/profile.css";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
import { logout } from "../../networking/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { User } from "../../redux/reducers/commonTypes";
import UserLargeImage from "../components/users/profile/UserLargeImage";
import { LOGOUT } from "../../redux/actions/types";

const { Title, Paragraph } = Typography;

export default function UserProfile() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);

    const user: User = useAppSelector((state) => state.auth.currentUser);

    const logoutHandler = () => {
        dispatch({ type: LOGOUT });
        logout();
        navigate("/login");
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col style={{ paddingRight: 30 }}>
                    <UserLargeImage user={user} editable={true} />
                </Col>
                <Col span={16}>
                    <div>
                        <Title level={2}>
                            {user?.first_name} {user?.last_name}
                        </Title>
                        <Title
                            level={4}
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {user?.email}&nbsp;
                            {user?.verified_email ? (
                                <CheckCircleOutlined
                                    style={{ color: "#40a9ff", marginLeft: 1 }}
                                />
                            ) : (
                                <Tooltip
                                    placement="right"
                                    title={
                                        "Your email is not verified. (no way to verify yet except by asking the admin)"
                                    }
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                            )}
                        </Title>
                        <Paragraph>
                            Joined {moment(user?.created_at).fromNow()}
                        </Paragraph>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                    <div onClick={logoutHandler}>
                        <Button danger>Logout</Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
