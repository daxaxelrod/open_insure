import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { Wizard } from "react-use-wizard";
import { AnimatePresence } from "framer-motion";
import { Col, Form, Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getAvailablePolicyLines } from "../../../../redux/actions/guesses";
import AnimatedStep from "./AnimatedStep";
import PolicyLineStep from "./steps/PolicyLineStep";
import AssetForm from "./steps/AssetForm";
import LossForm from "./steps/LossForm";
import AssetGuessFormHeader from "./AssetGuessFormHeader";

export default function AssetGuessForm({
    setAtSecondStep,
}: {
    setAtSecondStep: Dispatch<SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAvailablePolicyLines());
    }, []);

    const previousStep = useRef<number>(0);
    const [form] = Form.useForm();

    const onFormChange = async () => {
        let values = await form.validateFields();

        console.log("onFormChange", values);
    };

    const submitForm = async () => {
        console.log("submitForm");
        let values = await form.validateFields();
    };

    return (
        <div
            style={{
                minHeight: "90vh",
            }}
        >
            <AssetGuessFormHeader />
            <Row>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 16, offset: 4 }}
                    lg={{ span: 16, offset: 4 }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onValuesChange={onFormChange}
                        size={"middle"}
                        onFinish={submitForm}
                        requiredMark={false}
                    >
                        <Wizard
                            wrapper={
                                <AnimatePresence initial={false} mode="wait" />
                            }
                        >
                            <AnimatedStep previousStep={previousStep}>
                                <PolicyLineStep
                                    number={1}
                                    setAtSecondStep={setAtSecondStep}
                                />
                            </AnimatedStep>
                            <AnimatedStep previousStep={previousStep}>
                                <AssetForm submitForm={submitForm} />
                            </AnimatedStep>
                            <AnimatedStep previousStep={previousStep}>
                                <LossForm submitForm={submitForm} />
                            </AnimatedStep>
                        </Wizard>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}
