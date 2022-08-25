import React, { useState } from "react";
import type { UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Upload, Modal } from "antd";

import { Risk, Image } from "../../../../../redux/reducers/commonTypes";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import { getBase64 } from "../../utils/photoUtils";

// auto upload image to risk, dont rely on the parent form
export default function PropertyImageForm({ risk }: { risk: Risk }) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const { content_object } = risk;
    const album = content_object?.album;

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

    const fileList: UploadFile<any>[] = album.map((image: Image) => {
        return {
            uid: image.id,
            name: "image.png",
            status: "done",
            url: image.image,
        };
    });

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
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
