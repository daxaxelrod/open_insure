import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { Wizard } from "react-use-wizard";
import { AnimatePresence } from "framer-motion";
import { Col, Form, Row, notification } from "antd";
import { useAppDispatch } from "../../../../redux/hooks";
import { getAvailablePolicyLines } from "../../../../redux/actions/guesses";
import { public_submitActuaryGuess } from "../../../../networking/guesses";
import AnimatedStep from "./AnimatedStep";
import PolicyLineStep from "./steps/PolicyLineStep";
import AssetForm from "./steps/AssetForm";
import LossForm from "./steps/LossForm";
import AssetGuessFormHeader from "./AssetGuessFormHeader";
import ReactGA from "react-ga4";

export default function AssetGuessForm({
    setAtSecondStep,
}: {
    setAtSecondStep: Dispatch<SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();
    const [pending, setPending] = useState(false);

    useEffect(() => {
        dispatch(getAvailablePolicyLines());
    }, []);

    const previousStep = useRef<number>(0);
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const onFormChange = async () => {
        let values = await form.validateFields();

        console.log("onFormChange", values);
    };

    const submitForm = async () => {
        console.log("submitting form");
        // let values = await form.validateFields();
        let values = {};
        try {
            let result = await public_submitActuaryGuess({
                ...values,
            });
            if (result.status === 200) {
                console.log("success", result.data);
                ReactGA.event({
                    category: "Contribute",
                    action: "Submit an asset datapoint",
                });
            }
            setPending(false);
        } catch (error) {
            setPending(false);
            console.log("error submitting data point", error);
        }
    };

    return (
        <div
            style={{
                minHeight: "90vh",
            }}
        >
            {contextHolder}
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
                        onSubmitCapture={() => {
                            console.log("onSubmitCapture");
                        }}
                        onFinish={submitForm}
                        onFinishFailed={({ errorFields }) => {
                            for (let i = 0; i < errorFields.length; i++) {
                                const err = errorFields[i];
                                api.error({
                                    message: err.errors[0],
                                    placement: "topLeft",
                                });
                            }
                        }}
                        preserve
                        requiredMark={false}
                    >
                        <Wizard
                            wrapper={
                                <AnimatePresence initial={false} mode="wait" />
                            }
                        >
                            <AnimatedStep previousStep={previousStep}>
                                <PolicyLineStep
                                    form={form}
                                    number={1}
                                    setAtSecondStep={setAtSecondStep}
                                />
                            </AnimatedStep>
                            <AnimatedStep previousStep={previousStep}>
                                <AssetForm />
                            </AnimatedStep>
                            <AnimatedStep previousStep={previousStep}>
                                <LossForm />
                            </AnimatedStep>
                        </Wizard>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}
