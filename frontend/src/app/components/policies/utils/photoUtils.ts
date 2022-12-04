import { RcFile } from "antd/es/upload";

export const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const getUserPhotoUrl = (picture?: string): string => {
    if (picture) {
        if (picture.startsWith("http")) {
            return picture;
        } else {
            return process.env.REACT_APP_BACKEND_URL + picture;
        }
    } else {
        return "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";
    }
};
