import { Button, Form, Row, Space } from "antd";
import React from "react";
import { useWizard } from "react-use-wizard";

export default function AssetForm({ submitForm }: { submitForm: () => void }) {
    const { handleStep, nextStep, previousStep, isLastStep } = useWizard();
    const [form] = Form.useForm();
    const isFormFilledOut = false; // Form.useWatch("property_type", form);
    const hasHadLosses = Form.useWatch("has_had_losses", form);

    return (
        <div>
            <Row>
                <Space>
                    <Button
                        onClick={hasHadLosses ? nextStep : submitForm}
                        type={"default"}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={nextStep}
                        type={isFormFilledOut ? "primary" : "default"}
                    >
                        {isLastStep ? "Submit" : "Go Next"}
                    </Button>
                </Space>
            </Row>
        </div>
    );
}
