import styled from "styled-components";
import { Typography } from "antd";
const { Paragraph } = Typography;

interface ParaProps {
    readonly color?: string;
    readonly size?: string;
}

export const NoMarginParagraph = styled(Paragraph)<ParaProps>(
    ({ color, size }: ParaProps) => ({
        marginBottom: "0 !important",
        ...(color ? { color } : {}),
        ...(size ? { fontSize: size } : {}),
    })
);
