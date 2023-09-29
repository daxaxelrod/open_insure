import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Grid,
    Typography,
} from "antd";
import { useWizard } from "react-use-wizard";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../redux/hooks";

const { Title } = Typography;

export default function AssetForm() {
    const { nextStep, previousStep } = useWizard();
    const form = Form.useFormInstance();
    const grid = Grid.useBreakpoint();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const contribution = useAppSelector(
        (state) => state.actuary.activePropertyLifeDatePoint
    );
    const isMdOrBelow = (grid.xs || grid.sm || grid.md) && !grid.lg;

    const hasHadLosses = Form.useWatch("has_had_losses", form);
    const purchaseDate = Form.useWatch("purchase_date", form);
    const conditionalGoNext = () => {
        if (hasHadLosses) {
            nextStep();
        } else {
            setIsSubmitting(true);
            form.submit();
            setTimeout(() => {
                setIsSubmitting(false);
            }, 5000);
        }
    };

    const monthsOld = purchaseDate
        ? Math.abs(
              Math.round(
                  purchaseDate.diff(new Date()) / 1000 / 60 / 60 / 24 / 30
              )
          )
        : null;

    useEffect(() => {
        if (contribution) {
            setIsSubmitting(false);
        }
    }, [contribution]);

    useEffect(() => {
        const handleBeforeUnload = (e: any) => {
            e.preventDefault();
            e.returnValue = "Click go back if you dont want to lose your data";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <div>
            <Row>
                <Col span={12}>
                    <Form.Item
                        label="When did you purchase it?"
                        name="purchase_date"
                        required
                        rules={[
                            {
                                required: true,
                                message: "Please input the purchase date",
                            },
                        ]}
                    >
                        <DatePicker
                            autoFocus
                            disabledDate={(current) =>
                                current && current >= dayjs().endOf("day")
                            }
                            picker="month"
                            style={{
                                width: "100%",
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <div
                        style={{
                            marginLeft: "2rem",
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        {monthsOld ? (
                            <Title
                                level={isMdOrBelow ? 5 : 3}
                                style={{
                                    marginTop: 14,
                                }}
                            >
                                {monthsOld} months ago
                            </Title>
                        ) : null}
                    </div>
                </Col>
            </Row>

            <Form.Item
                label="Purchase Price"
                name="purchase_price"
                required
                rules={[
                    {
                        required: true,
                        message: "Please input the purchase price",
                    },
                    () => ({
                        validator(rule, value) {
                            let toTest = Number(value);
                            if (toTest === 0) {
                                return Promise.resolve();
                            }
                            if (toTest < 50) {
                                return Promise.reject("$50 Minimum");
                            }
                            if (toTest > 20000) {
                                return Promise.reject("$20,000 Maximum");
                            }
                            return Promise.resolve();
                        },
                    }),
                ]}
            >
                <InputNumber addonBefore="$" placeholder="300" step={10} />
            </Form.Item>
            <Form.Item label="Manufacturer" name="property_make">
                <Input placeholder="Apple, Dior, Rolex" />
            </Form.Item>
            <div
                style={{
                    marginBottom: "10px",
                }}
            >
                Has it even been damaged or completely broken?
            </div>
            <Form.Item valuePropName="checked" name={"has_had_losses"}>
                <Checkbox>Yes</Checkbox>
            </Form.Item>

            <Row
                style={{
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={previousStep} type={"default"}>
                    Back
                </Button>
                <Button
                    onClick={conditionalGoNext}
                    loading={isSubmitting}
                    disabled={!!contribution}
                    type={"default"}
                >
                    Next
                </Button>
            </Row>
        </div>
    );
}
