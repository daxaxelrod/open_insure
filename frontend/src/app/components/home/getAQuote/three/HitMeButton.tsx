import React from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

import colors from "../../../../constants/colors";
import useIsTouchDevice from "../../../hooks/useIsTouchDevice";

export default function HitMeButton() {
    const isTouchScreen = useIsTouchDevice();

    return (
        <Html center>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                    width: 100,
                }}
            >
                <motion.div
                    style={{
                        padding: "1rem",
                        borderRadius: 14,
                        borderColor: colors.alert1,
                        borderWidth: 2,
                        borderStyle: "solid",
                        backgroundColor: "white",
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        textAlign: "center",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 1.5,
                        duration: 1.25,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                >
                    {isTouchScreen ? "Drag the hammer" : "Hit me!"}
                </motion.div>
            </div>
        </Html>
    );
}
