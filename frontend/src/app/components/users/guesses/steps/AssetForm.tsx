import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Typography,
} from "antd";
import { useWizard } from "react-use-wizard";
import dayjs from "dayjs";

const { Title } = Typography;

export default function AssetForm() {
    const { nextStep, previousStep } = useWizard();
    const form = Form.useFormInstance();

    const hasHadLosses = Form.useWatch("has_had_losses", form);
    const purchaseDate = Form.useWatch("purchase_date", form);
    const conditionalGoNext = () => {
        hasHadLosses ? nextStep() : form.submit();
    };

    const monthsOld = purchaseDate
        ? Math.abs(
              Math.round(
                  purchaseDate.diff(new Date()) / 1000 / 60 / 60 / 24 / 30
              )
          )
        : null;

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
                                level={3}
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
                            return Promise.resolve();
                        },
                    }),
                ]}
            >
                <Input addonBefore="$" placeholder="300" />
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
                <Button onClick={conditionalGoNext} type={"default"}>
                    Next
                </Button>
            </Row>
        </div>
    );
}
