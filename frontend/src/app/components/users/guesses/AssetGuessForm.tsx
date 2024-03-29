import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { Wizard } from "react-use-wizard";
import { AnimatePresence } from "framer-motion";
import { Col, Form, Grid, Row, Spin, notification } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    getActuarialStatsForPolicyLine,
    getAvailablePolicyLines,
    setActivePropertyLifeDatePoint,
} from "../../../../redux/actions/guesses";
import { public_submitActuaryGuess } from "../../../../networking/guesses";
import AnimatedStep from "./AnimatedStep";
import PolicyLineStep from "./steps/PolicyLineStep";
import AssetForm from "./steps/AssetForm";
import LossForm, { LossType } from "./steps/LossForm";
import AssetGuessFormHeader from "./AssetGuessFormHeader";
import ReactGA from "react-ga4";
import { isLoggedIn } from "axios-jwt";
import { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";

export default function AssetGuessForm({
    setAtSecondStep,
}: {
    setAtSecondStep: Dispatch<SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();
    const [pending, setPending] = useState(false);
    let loggedIn = isLoggedIn();
    const grid = Grid.useBreakpoint();
    const isMdOrBelow = window.innerWidth < 992 || (grid.md && !grid.lg);
    const navigate = useNavigate();
    const getPolicyLinesPending = useAppSelector(
        (state) => state.actuary.getPolicyLinesPending
    );

    useEffect(() => {
        // https://react.dev/learn/synchronizing-with-effects#fetching-data
        // react can be dumb sometimes
        let ignore = false;
        async function retrieve() {
            if (!ignore) {
                dispatch(getAvailablePolicyLines());
            }
        }
        retrieve();

        return () => {
            ignore = true;
        };
    }, []);

    const previousStep = useRef<number>(0);
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const submitForm = async () => {
        let values = await form.validateFields();
        const {
            property_type,
            property_make,
            purchase_date,
            purchase_price,
            has_had_losses,
            losses,
        } = form.getFieldsValue([
            "property_type", // page 1

            "property_make", // page 2
            "purchase_date",
            "purchase_price",
            "has_had_losses",

            "losses", // page 3
        ]);

        if (!property_type) {
            api.error({
                message: "Please select a property type (first page)",
            });
            return;
        }

        if (has_had_losses && losses.length === 0) {
            api.error({
                message: "Please add at least one loss (last page)",
            });
            return;
        }

        try {
            let result = await public_submitActuaryGuess({
                ...values,
                purchase_date: purchase_date.toDate(),
                property_type: property_type,
                losses: has_had_losses
                    ? losses.map((loss: LossType) => ({
                          ...loss,
                          date: (loss.loss_date as unknown as Dayjs).toDate(),
                      }))
                    : [],
                property_make,
                purchase_price: Math.round(purchase_price),
            });
            if (result.status >= 200 && result.status < 300) {
                ReactGA.event({
                    category: "Contribute",
                    action: "Submit an asset datapoint",
                });

                dispatch(setActivePropertyLifeDatePoint(result.data));
                if (result.data.property_line.id) {
                    dispatch(
                        getActuarialStatsForPolicyLine(
                            result.data.property_line.id
                        )
                    );
                } else {
                    // should never happen
                }

                if (isMdOrBelow) {
                    // navigate to the second page where the stats will be shown
                    navigate("/contribute/stats");
                }

                if (!loggedIn) {
                    console.log(
                        "Saving contribution to local storage for reatribution to this anon later if they'd like"
                    );
                    let keyName = "unattributedContributions";
                    let existingContributions: any[] =
                        JSON.parse(localStorage.getItem(keyName) || "[]") || [];
                    existingContributions.push(result.data);
                    localStorage.setItem(
                        keyName,
                        JSON.stringify(existingContributions)
                    );
                }
            }
            setPending(false);
        } catch (error) {
            setPending(false);
            console.log("error submitting data point", error);
        }
    };

    return (
        <div>
            {contextHolder}
            <AssetGuessFormHeader />
            <Row>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 16, offset: 4 }}
                    lg={{ span: 16, offset: 4 }}
                >
                    <Spin spinning={pending}>
                        <Form
                            form={form}
                            layout="vertical"
                            size={"middle"}
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
                                    <AnimatePresence
                                        initial={false}
                                        mode="wait"
                                    />
                                }
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
                    </Spin>
                </Col>
            </Row>
        </div>
    );
}
