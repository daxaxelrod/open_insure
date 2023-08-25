import React, { useState } from "react";
import { Col, Row, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, message, Upload, Modal } from "antd";

import {
    Risk,
    Image,
    Policy,
} from "../../../../../redux/reducers/types/commonTypes";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { getBase64 } from "../../utils/photoUtils";
import { getAssetTypeName } from "../../../../utils/riskUtils";
import {
    deleteRiskPhoto,
    uploadRiskImage,
} from "../../../../../networking/risk";
import { useAppDispatch } from "../../../../../redux/hooks";
import { updatePhotoSet } from "../../../../../redux/actions/risk";
import { RcFile } from "antd/es/upload";
const { Paragraph } = Typography;

// auto upload image to risk, dont rely on the parent form
export default function PropertyImageForm({
    editable = true,
    risk,
    policy,
}: {
    editable: boolean;
    risk: Risk;
    policy: Policy;
}) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const { content_object } = risk;
    const album: Image[] = content_object?.album;
    const dispatch = useAppDispatch();

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
        // sometimes newFileList has a .status ==='removed'
        // othger times it just removes it completely, then check against the original album which is in state
        let removedItems = newFileList.filter(
            (file: UploadFile) => file.status === "removed"
        );
        let justRemovedItemIds = removedItems.map((item) => item.uid);
        let remainingItems = album?.filter(
            (image) => justRemovedItemIds.indexOf(image.id.toString()) === -1
        );

        if (removedItems.length === 1) {
            await deleteRiskPhoto(parseInt(removedItems[0].uid));
            dispatch(updatePhotoSet(remainingItems));
        } else if (
            removedItems.length === 0 &&
            album.length &&
            newFileList.length !== album.length
        ) {
            // find the removed items
            let existingIds = newFileList.map((file) => file.uid);
            let imagesToRemove: Image[] = album.filter(
                (image) => existingIds.indexOf(image.id.toString()) === -1
            );
            for (let image of imagesToRemove) {
                await deleteRiskPhoto(image.id);
            }
            dispatch(
                updatePhotoSet(
                    album.filter(
                        (image) =>
                            existingIds.indexOf(image.id.toString()) !== -1
                    )
                )
            );
        }
    };

    const fileList: UploadFile<any>[] = Array.isArray(album)
        ? album?.map((image: Image) => {
              return {
                  uid: image.id.toString(),
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
            dispatch(updatePhotoSet(res.data.images));
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
            <Row>
                <Col
                    sm={4}
                    xs={5}
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        paddingRight: 10,
                    }}
                >
                    <Paragraph>Photos: </Paragraph>
                </Col>
                <Col sm={10} xs={16}>
                    <Upload
                        listType="picture-card"
                        customRequest={uploadImage}
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        disabled={!editable}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </Col>

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
            </Row>
        </>
    );
}
