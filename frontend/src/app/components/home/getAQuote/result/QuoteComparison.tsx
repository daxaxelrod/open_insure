import React, { useContext } from "react";
import { PublicQuoteContext } from "../../../contexts/PublicQuoteContext";
import { motion } from "framer-motion";
import { Card, Typography } from "antd";

const { Paragraph } = Typography;

export default function QuoteComparison() {
    const { quote } = useContext(PublicQuoteContext);
    const hasComparison = false;
    return (
        <div>
            <Card>
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        ease: "out",
                    }}
                >
                    blahs
                    <Paragraph>{JSON.stringify(quote, null, 2)}</Paragraph>
                </motion.div>
            </Card>
        </div>
    );
}
