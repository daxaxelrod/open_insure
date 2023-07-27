import React, { useContext } from "react";
import { PublicQuoteContext } from "../../../contexts/PublicQuoteContext";
import { motion } from "framer-motion";
import { Card, Row, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

export default function QuoteComparison() {
    const { quote, setQuote } = useContext(PublicQuoteContext);
    const hasComparison = false;
    return (
        <motion.div
            style={{
                marginTop: "3rem",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                delay: 0.1,
                duration: 0.5,
            }}
        >
            <Card
                bordered={false}
                style={{
                    width: 500,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.75,
                        type: "spring",
                        damping: 15,
                        stiffness: 100,
                    }}
                >
                    <Paragraph>
                        <pre>{JSON.stringify(quote, null, 2)}</pre>
                    </Paragraph>
                </motion.div>
            </Card>
            <Row>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: 4.5,
                        duration: 1.3,
                        ease: "easeOut",
                    }}
                    style={{
                        color: "rgba(0, 0, 0, 0.45)",
                        padding: ".75rem 0",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        setQuote(null);
                    }}
                >
                    Start Over
                    <ReloadOutlined style={{ marginLeft: 4 }} />
                </motion.div>
            </Row>
        </motion.div>
    );
}
