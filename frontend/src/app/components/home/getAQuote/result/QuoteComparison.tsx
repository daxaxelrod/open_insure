import React, { useContext } from "react";
import { PublicQuoteContext } from "../../../contexts/PublicQuoteContext";
import { motion } from "framer-motion";
import { Button, Card, Col, Divider, Row, Tooltip, Typography } from "antd";
import { ReloadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import PerilGridDisplay from "../../../policies/detail/PerilGridDisplay";
import { Peril } from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";
import { Link } from "react-router-dom";

const { Title } = Typography;

const mockPerils: Peril[] = [
    {
        name: "Water Damage",
        id: 1,
        description: "Spilled water on it or dropped in the toilet",
        icon_name: "alert",
    },
    {
        id: 2,
        name: "Broken Screen",
        description: "Cracked or broken screen",
        icon_name: "meh",
    },
    {
        id: 3,
        name: "Other Damage",
        description:
            "What gets covered is decided by you and your fellow policy holders",
        icon_name: "crown",
    },
];

export default function QuoteComparison() {
    const { quote, setQuote } = useContext(PublicQuoteContext);
    const potentialRefundAmount =
        ((quote.risk_settings.conservative_factor / 100) *
            quote.premium_amount) /
        100;
    const hasComparison = false;
    return (
        <motion.div
            style={{
                marginTop: "3rem",
                width: 500,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                delay: 0.1,
                duration: 0.5,
            }}
        >
            <Card bordered={false}>
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.5,
                        type: "spring",
                        damping: 15,
                        stiffness: 100,
                    }}
                >
                    <Divider
                        orientation="left"
                        style={{
                            marginTop: 0,
                        }}
                    >
                        Your Quote
                    </Divider>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",

                                flexDirection: "column",
                                marginLeft: "5%",
                            }}
                        >
                            <Title
                                level={3}
                                style={{
                                    margin: 0,
                                }}
                            >
                                ${(quote.premium_amount / 100).toFixed(2)}{" "}
                            </Title>
                            <Title
                                level={5}
                                style={{
                                    margin: 0,
                                    textAlign: "end",
                                    color: "rgba(0, 0, 0, 0.45)",
                                }}
                            >
                                - ${potentialRefundAmount.toFixed(2)}{" "}
                            </Title>
                            <Divider
                                style={{
                                    borderBlockStart:
                                        "2px solid rgba(5, 5, 5, .26)",
                                    marginTop: 3,
                                    marginBottom: 5,
                                }}
                            />
                            <Title
                                level={4}
                                style={{
                                    textAlign: "end",
                                }}
                            >
                                $
                                {(
                                    quote.premium_amount / 100 -
                                    potentialRefundAmount
                                ).toFixed(2)}{" "}
                            </Title>
                        </div>
                        <div
                            className="premiumDescriptorsContainer"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingLeft: ".5rem",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: ".8rem",
                                    fontWeight: 400,
                                    color: "rgba(0, 0, 0, 0.85)",
                                    marginTop: 10,
                                }}
                            >
                                per month
                            </span>
                            <span
                                style={{
                                    fontSize: ".8rem",
                                    fontWeight: 400,
                                    color: "rgba(0, 0, 0, 0.85)",
                                    marginTop: 4,
                                }}
                            >
                                potential refund
                                <Tooltip
                                    color="black"
                                    placement="rightTop"
                                    title={() => (
                                        <div style={{ padding: 10 }}>
                                            Refund amount is based on a
                                            conservative factor that represents
                                            how much more premium is collects vs
                                            what is actuarially needed to cover
                                            claims. The higher the factor, the
                                            safer the policy and the higher the
                                            potential refund.
                                        </div>
                                    )}
                                >
                                    <QuestionCircleOutlined
                                        style={{
                                            color: colors.gray7,
                                            padding: "3px 10px 10px 3px",
                                            marginLeft: 1,
                                        }}
                                    />
                                </Tooltip>
                            </span>
                        </div>
                    </div>

                    <Divider
                        orientation="left"
                        style={{
                            marginTop: 30,
                        }}
                    >
                        Covered Events
                    </Divider>
                    <Row>
                        {mockPerils.map((peril) => (
                            <Col
                                span={12}
                                style={{ padding: "1rem 0 2rem 0" }}
                                key={`${peril.id}-mock`}
                            >
                                <PerilGridDisplay peril={peril} />
                            </Col>
                        ))}
                    </Row>
                    <Link to="/join">
                        <Button type="primary" size="large">
                            Learn More
                        </Button>
                    </Link>
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

                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flex: 1,
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
