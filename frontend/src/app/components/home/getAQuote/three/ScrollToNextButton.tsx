import React, { TouchEventHandler } from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

import colors from "../../../../constants/colors";
import { ArrowDownOutlined } from "@ant-design/icons";
import { Typography } from "antd";
const { Paragraph } = Typography;

export default function ScrollToNextButton({ nextId }: { nextId: string }) {
    return (
        <div
            style={{
                position: "absolute",
                height: 80,
                width: 130,
                bottom: 0,
                right: 0,
                zIndex: 16929,
                // height: 650, // 650 / 2 + padding
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
            }}
        >
            <div
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 80,
                    width: 130,
                    marginRight: 20,
                }}
            >
                <motion.div
                    style={{
                        padding: "1rem",
                        borderRadius: 14,
                        backgroundColor: "rgba(255, 255, 255, 0.36)",
                        borderWidth: 2,
                        borderStyle: "solid",
                        borderColor: colors.gray6,
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={(e: any) => {
                        e.stopPropagation();
                        document.getElementById(nextId)?.scrollIntoView({
                            behavior: "smooth",
                        });
                    }}
                    onTouchStartCapture={(e: any) => {
                        e.stopPropagation();
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 1.5,
                        duration: 1.25,
                        bounce: 0.5,
                        type: "spring",
                    }}
                >
                    <Paragraph
                        style={{
                            margin: 0,
                            fontSize: 12,
                            color: colors.gray8,
                        }}
                    >
                        Continue
                    </Paragraph>
                    <ArrowDownOutlined
                        style={{ fontSize: 14, marginLeft: 5 }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
