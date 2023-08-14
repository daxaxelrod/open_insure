import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Row,
    Statistic,
    Switch,
} from "antd";
import React from "react";
import { useWizard } from "react-use-wizard";
import { CloseOutlined } from "@ant-design/icons";
import { CheckOutlined } from "@ant-design/icons";
import { RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";

export default function AssetForm({ submitForm }: { submitForm: () => void }) {
    const { handleStep, nextStep, previousStep, isLastStep } = useWizard();
    const form = Form.useFormInstance();

    const hasHadLosses = Form.useWatch("has_had_losses", form);
    const purchaseDate = Form.useWatch("purchase_date", form);

    const marketValueValidator = (
        rule: RuleObject,
        value: StoreValue,
        callback: (error?: string) => void
    ) => {
        try {
            value = Number(value);

            if (value === 0) {
                return;
            }
            if (value < 50) {
                callback("$50 Minimum");
            }
        } catch (error) {
            // Handle errors converting the value to a number.
        }
    };

    const conditionalGoNext = () => {
        return hasHadLosses ? nextStep() : submitForm();
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
                <Form.Item
                    label="When did you purchase it?"
                    name="purchase_date"
                    required
                >
                    <DatePicker picker="month" />
                </Form.Item>
                <div
                    style={{
                        marginLeft: "2rem",
                    }}
                >
                    {monthsOld ? (
                        <Statistic title="Months Old" value={monthsOld} />
                    ) : null}
                </div>
            </Row>

            <Form.Item
                label="Purchase Price"
                name="purchase_price"
                required
                rules={[
                    {
                        type: "number",
                        validator: marketValueValidator,
                    },
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
