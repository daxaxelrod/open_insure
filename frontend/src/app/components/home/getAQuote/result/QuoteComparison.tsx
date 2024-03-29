import { useContext, useEffect } from "react";
import { PublicQuoteContext } from "../../../contexts/PublicQuoteContext";
import { motion } from "framer-motion";
import {
    Button,
    Card,
    Col,
    Divider,
    Grid,
    Row,
    Tooltip,
    Typography,
} from "antd";
import { ReloadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import PerilGridDisplay from "../../../policies/detail/PerilGridDisplay";
import { Peril } from "../../../../../redux/reducers/types/commonTypes";
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

    const grid = Grid.useBreakpoint();
    const isMobile =
        grid.lg !== undefined && !grid.lg && !grid.xl && !grid.xxl && !grid.md;

    useEffect(() => {
        if (typeof quote?.premium_amount === "number" && isMobile) {
            const section = document.querySelector(
                "#public-demo-quote-explanation"
            );
            section?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [isMobile, quote]);

    return (
        <motion.div
            style={{
                marginTop: isMobile ? "1.4rem" : "3.4rem",
                marginBottom: isMobile ? "1.4rem" : "0",
                width: !isMobile ? 500 : "calc(100% - 1.5rem)",
                marginLeft: isMobile ? ".75rem" : 0,
                marginRight: isMobile ? ".75rem" : 0,
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
                    initial={{ opacity: 0, y: 15 }}
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
                                    marginBottom: 5,
                                }}
                            >
                                ${(quote.premium_amount / 100).toFixed(2)}{" "}
                            </Title>
                            <Title
                                level={5}
                                style={{
                                    margin: 0,
                                    marginBottom: 5,
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
                                    marginBottom: 10,
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
                                    marginTop: 10,
                                }}
                            >
                                potential refund
                                <Tooltip
                                    color="black"
                                    placement={isMobile ? "bottom" : "rightTop"}
                                    overlayStyle={{
                                        minWidth: 320,
                                    }}
                                    title={() => (
                                        <div style={{ padding: 10 }}>
                                            <div>
                                                Refund amount varies by policy
                                                and depends on the cost to cover
                                                claims during the coverage
                                                period. Policies with more
                                                conservative underwriting
                                                assumptions tend to have higher
                                                premiums and also larger
                                                potential refunds. Refunds are
                                                not guaranteed.
                                            </div>
                                        </div>
                                    )}
                                >
                                    <QuestionCircleOutlined
                                        style={{
                                            color: colors.gray7,
                                            padding: "3px 10px 10px 3px",
                                            marginLeft: isMobile ? 3 : 1,
                                            cursor: "pointer",
                                        }}
                                    />
                                </Tooltip>
                            </span>
                            <span
                                style={{
                                    fontSize: ".8rem",
                                    fontWeight: 400,
                                    color: "rgba(0, 0, 0, 0.85)",
                                    marginTop: 20,
                                }}
                            >
                                actual cost
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
                    <Row
                        style={{
                            marginBottom: 30,
                        }}
                    >
                        {mockPerils.map((peril) => (
                            <Col
                                span={12}
                                style={{
                                    padding: isMobile
                                        ? "1.25rem 0"
                                        : ".75rem 2rem .5rem",
                                }}
                                key={`${peril.id}-mock`}
                            >
                                <PerilGridDisplay peril={peril} />
                            </Col>
                        ))}
                    </Row>
                    <Link
                        to="/join"
                        style={{
                            marginLeft: isMobile ? "0" : "2rem",
                        }}
                    >
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                ...(isMobile
                                    ? {
                                          width: "100%",
                                      }
                                    : {}),
                            }}
                        >
                            Register to learn more
                        </Button>
                    </Link>
                </motion.div>
            </Card>
            <Row>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: isMobile ? 2.5 : 4.5,
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
                        if (isMobile) {
                            const section = document.querySelector(
                                "#public-demo-quote-form"
                            );
                            section?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }
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
