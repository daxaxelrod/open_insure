import React, { useState } from "react";
import {
    Col,
    Image,
    Row,
    Button,
    Typography,
    Tooltip,
    Upload,
    UploadProps,
} from "antd";
import "../styles/dashboard/profile.css";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
import { logout } from "../../networking/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { User } from "../../redux/reducers/commonTypes";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { uploadProfilePicture } from "../../networking/users";
import { updateProfile } from "../../redux/actions/users";

import colors from "../constants/colors";
import { getUserPhotoUrl } from "../components/policies/utils/photoUtils";

const { Title, Paragraph } = Typography;

export default function UserProfile() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);

    const user: User = useAppSelector((state) => state.auth.currentUser);

    const logoutHandler = () => {
        logout();
        navigate("/login");
    };

    const changProfilePicProps: UploadProps = {
        showUploadList: false,
        customRequest: async (options: UploadRequestOption) => {
            const { onSuccess, onError, file, onProgress } = options;
            if (!onSuccess || !onProgress || !onError) {
                return;
            }

            const fmData = new FormData();
            const config = {
                headers: { "content-type": "multipart/form-data" },
                onUploadProgress: (event: any) => {
                    const percent = Math.floor(
                        (event.loaded / event.total) * 100
                    );
                    onProgress({ percent });
                },
            };
            fmData.append("profile_picture", file);
            try {
                const res = await uploadProfilePicture(fmData, config);
                dispatch(updateProfile(res.data));
                onSuccess("Ok");
            } catch (err: any) {
                onError({
                    name: "error logging",
                    message: err,
                    status: 400,
                });
            }
        },
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col style={{ paddingRight: 30 }}>
                    <Image
                        width={200}
                        style={{ borderRadius: 14 }}
                        src={getUserPhotoUrl(user?.picture)}
                        preview={{
                            visible: visible,
                            onVisibleChange: (value) => {
                                setVisible(value);
                            },

                            mask: (
                                <div>
                                    <EyeOutlined /> Preview
                                    <div
                                        style={{
                                            position: "absolute",
                                            right: 5,
                                            bottom: 5,
                                            zIndex: 100,
                                        }}
                                    >
                                        <Upload {...changProfilePicProps}>
                                            <div
                                                style={{
                                                    background: colors.gray2,
                                                    padding: "4px 8px",
                                                    borderRadius: 20,
                                                }}
                                            >
                                                <EditOutlined
                                                    style={{
                                                        color: "black",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                                {" Edit"}
                                            </div>
                                        </Upload>
                                    </div>
                                </div>
                            ),
                        }}
                    />
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
