import React, { useState } from "react";
import { Image, Upload, UploadProps } from "antd";
import { User } from "../../../../redux/reducers/commonTypes";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

import { UploadRequestOption } from "rc-upload/lib/interface";
import { uploadProfilePicture } from "../../../../networking/users";
import { updateProfile } from "../../../../redux/actions/users";

import colors from "../../../constants/colors";
import { getUserPhotoUrl } from "../../policies/utils/photoUtils";
import { useAppDispatch } from "../../../../redux/hooks";

export default function UserLargeImage({
    user,
    editable,
}: {
    user: User;
    editable: boolean;
}) {
    const [visible, setVisible] = useState(false);

    const dispatch = useAppDispatch();

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
        <Image
            width={200}
            style={{ borderRadius: 14 }}
            src={getUserPhotoUrl(user?.picture)}
            preview={{
                visible: visible,
                onVisibleChange: (value) => {
                    setVisible(value);
                },

                mask: editable ? (
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
                ) : null,
            }}
        />
    );
}
