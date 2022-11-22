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
    removeEvidence: (evidenceId: number) => void;
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
    removeEvidence,
}: ClaimEvidencePhotoUploadProps) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);

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

    const uploadEvidence = async (options: RcCustomRequestOptions) => {
        const config = {
            onUploadProgress: options.onProgress,
            onUploadSuccess: options.onSuccess,
            onUploadError: options.onError,
        };

        let formData = new FormData();
        formData.append("image", options.file);
        formData.append("photo_order", fileList.length + 1 + "");
        formData.append("evidence_type", "photo");

        try {
            let results = await createClaimEvidence(
                policy?.id,
                formData,
                config
            );
            let lastItem = fileList?.[fileList.length - 1];
            setFileList([
                ...fileList,
                {
                    ...lastItem,
                    status: "done",
                    name: (options?.file as any)?.name || "", // @ts-ignore
                    url: results.data.image,
                    uid: results.data.id,
                },
            ]);
            onUploadSuccess(results.data.id);
        } catch (err) {
            let lastItem = fileList?.[fileList.length - 1];
            setFileList([
                ...fileList.slice(0, -1),
                {
                    ...lastItem,
                    status: "error",
                },
            ]);
            onUploadError();
        }
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
                accept="image/png, image/jpeg, image/jpg"
                onRemove={(file) => {
                    try {
                        removeEvidence(parseInt(file.uid));
                    } catch (err) {
                        console.log(err);
                    }
                }}
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
                    alt="claim evidence"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </Form.Item>
    );
}
