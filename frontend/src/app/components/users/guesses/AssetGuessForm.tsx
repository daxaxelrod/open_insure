import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { Wizard } from "react-use-wizard";
import { AnimatePresence } from "framer-motion";
import { Form } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getAvailablePolicyLines } from "../../../../redux/actions/guesses";
import AnimatedStep from "./AnimatedStep";
import PolicyLineStep from "./PolicyLineStep";
import AssetForm from "./AssetForm";
import LossForm from "./LossForm";
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

    const onFormChange = () => {
        console.log("onFormChange");
    };

    const submitForm = () => {
        console.log("submitForm");
    };

    return (
        <div
            style={{
                minHeight: "90vh",
            }}
        >
            <AssetGuessFormHeader />
            <Form
                form={form}
                layout="vertical"
                onValuesChange={onFormChange}
                size={"middle"}
                onFinish={submitForm}
                requiredMark={false}
            >
                <Wizard
                    wrapper={<AnimatePresence initial={false} mode="wait" />}
                >
                    <AnimatedStep previousStep={previousStep}>
                        <PolicyLineStep
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
        </div>
    );
}
