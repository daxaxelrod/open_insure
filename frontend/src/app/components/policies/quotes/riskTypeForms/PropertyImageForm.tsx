import React, { useState } from "react";
import type { UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, message, Upload, Modal } from "antd";

import { Risk, Image, Policy } from "../../../../../redux/reducers/commonTypes";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import { getBase64 } from "../../utils/photoUtils";
import { getAssetTypeName } from "../../../../utils/riskUtils";
import {
    deleteRiskPhoto,
    uploadRiskImage,
} from "../../../../../networking/risk";
import { useAppDispatch } from "../../../../../redux/hooks";
import { updatePhotoSet } from "../../../../../redux/actions/risk";
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
    const dispatch = useAppDispatch();

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

    const handleChange: UploadProps["onChange"] = async ({
        fileList: newFileList,
    }) => {
        let removedItems = newFileList.filter(
            (file: UploadFile) => file.status === "removed"
        );
        let justRemovedItemIds = removedItems.map((item) => item.uid);
        let remainingItems = album.filter(
            (image) => justRemovedItemIds.indexOf(image.id) === -1
        );
        if (removedItems.length === 1) {
            await deleteRiskPhoto(parseInt(removedItems[0].uid));
            dispatch(updatePhotoSet(remainingItems));
        }
    };

    const fileList: UploadFile<any>[] = Array.isArray(album)
        ? album?.map((image: Image) => {
              return {
                  uid: image.id,
                  name: "image.png",
                  status: "done",
                  url: process.env.REACT_APP_BACKEND_URL + image.image,
              };
          })
        : [] || [];

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
            dispatch(updatePhotoSet(res.data));
            onSuccess("Ok");
        } catch (err: any) {
            onError({
                name: "error logging",
                message: err,
                status: 400,
            });
        }
    };

    return (
        <>
            <Paragraph>Photos</Paragraph>
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
