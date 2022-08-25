import React, { useState } from "react";
import type { UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, message, Upload, Modal } from "antd";

import { Risk, Image, Policy } from "../../../../../redux/reducers/commonTypes";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import { getBase64 } from "../../utils/photoUtils";
import { getAssetTypeName } from "../../../../utils/riskUtils";
import { axiosInstance } from "../../../../../networking/api";
import { uploadRiskImage } from "../../../../../networking/risk";
const { Paragraph } = Typography;

// auto upload image to risk, dont rely on the parent form
export default function PropertyImageForm({
    risk,
    policy,
}: {
    risk: Risk;
    policy: Policy;
}) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const { content_object } = risk;
    const album = content_object?.album;

    console.log({ album });

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewVisible(true);
        setPreviewTitle(
            file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
        );
    };

    const handleChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        console.log("do something with the file", fileList);
    };

    const fileList: UploadFile<any>[] =
        album?.map((image: Image) => {
            return {
                uid: image.id,
                name: "image.png",
                status: "done",
                url: image.image,
            };
        }) || [];

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const uploadImage = async (options: UploadRequestOption) => {
        const { onSuccess, onError, file, onProgress } = options;
        if (!onSuccess || !onProgress || !onError) {
            return;
        }

        const fmData = new FormData();
        const config = {
            headers: { "content-type": "multipart/form-data" },
            onUploadProgress: (event: any) => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                onProgress({ percent });
            },
        };
        fmData.append("image", file);
        try {
            // maybe turn this inot an action if we want the displayed set to update
            const res = await uploadRiskImage(
                policy.id,
                risk.id,
                fmData,
                config
            );
            onSuccess("Ok");
            console.log("server res: ", res);
        } catch (err: any) {
            console.log("Eroor: ", err);
            const error = new Error("Some error");
            // onError({ err });
        }
    };

    return (
        <>
            <Paragraph>
                Upload at least 1 image of your {getAssetTypeName(risk)}
            </Paragraph>
            <Upload
                listType="picture-card"
                customRequest={uploadImage}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
}
