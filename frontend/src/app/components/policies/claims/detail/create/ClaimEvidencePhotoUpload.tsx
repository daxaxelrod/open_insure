import React, { useState } from "react";
import { Form, Modal, Upload, UploadProps } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import { Policy } from "../../../../../../redux/reducers/commonTypes";
import { createClaimEvidence } from "../../../../../../networking/claims";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";

// re_path("policies/(?P<policy_id>\d+)/claim_evidence/$",

type ClaimEvidencePhotoUploadProps = {
    policy: Policy;
    onUploadSuccess: (evidenceId: number) => void;
    onUploadError: () => void;
};

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export default function ClaimEvidencePhotoUpload({
    policy,
    onUploadSuccess,
    onUploadError,
}: ClaimEvidencePhotoUploadProps) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: "-xxx",
            percent: 50,
            name: "image.png",
            status: "uploading",
            url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
        {
            uid: "-5",
            name: "image.png",
            status: "error",
        },
    ]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
        );
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadEvidence = (options: RcCustomRequestOptions) => {
        debugger;
        return createClaimEvidence(policy?.id, {});
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Form.Item>
            <Upload
                maxCount={8}
                customRequest={uploadEvidence}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
                {fileList.length >= 8 ? "Maximum 8 photos" : null}
            </Upload>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="evidence photo"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </Form.Item>
    );
}
