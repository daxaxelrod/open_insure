import { FC, memo, useEffect, useMemo, useState } from "react";
import { useWizard } from "react-use-wizard";
import styled from "styled-components";
import { AutoComplete, Button, Form, Row, Space, Tag, Typography } from "antd";
import { PolicyLine } from "../../../../../redux/reducers/types/actuaryTypes";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {
    getActuarialStatsForPolicyLine,
    setActivePropertyLifeDatePoint,
} from "../../../../../redux/actions/guesses";
import useIsTouchDevice from "../../../hooks/useIsTouchDevice";
const { Paragraph } = Typography;

type Props = {
    number: number;
    setAtSecondStep: (value: boolean) => void;
};

const Container = styled("div")`
    padding: 2.75rem 0.35rem;
    flex-direction: column;
`;

const PolicyLineStep: FC<Props> = memo(({ number, setAtSecondStep }) => {
    const form = Form.useFormInstance();
    const { nextStep, isLastStep, handleStep } = useWizard();

    const dispatch = useAppDispatch();

    const allPolicyLines = useAppSelector((state) => state.actuary.policyLines);
    const [autoCompletePolicyLines, setAutoCompletePolicyLines] = useState<
        PolicyLine[]
    >([]);
    const isTouchDevice = useIsTouchDevice();

    const handlePolicyLineAutoComplete = (value: string) => {
        let res: PolicyLine[] = [];
        if (!value) {
            res = [];
        } else {
            res = allPolicyLines.filter(
                (policyLine: PolicyLine) =>
                    policyLine.name
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policyLine.description
                        ?.toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policyLine.search_tags
                        ?.toLowerCase()
                        .includes(value.toLowerCase())
            );
        }
        setAutoCompletePolicyLines(res);
    };

    handleStep(() => {
        setAtSecondStep(true);

        let policyLine = allPolicyLines.find(
            (policyLine: PolicyLine) =>
                policyLine.name === form.getFieldValue("property_type")
        );
        if (policyLine) {
            dispatch(getActuarialStatsForPolicyLine(policyLine.id));
        }

        dispatch(setActivePropertyLifeDatePoint(null));
    });

    const autoCompletePolicyLinesOptions = useMemo(
        () =>
            autoCompletePolicyLines.map((policyLine: PolicyLine) => ({
                key: policyLine.id,
                value: policyLine.name,
            })),
        [autoCompletePolicyLines]
    );

    const isFormFilledOut = Form.useWatch("property_type", form);

    const firstThreeRandomPolicyLines = useMemo(
        () =>
            [...allPolicyLines]
                .sort(() => Math.random() - Math.random())
                .slice(0, 3),
        [allPolicyLines]
    );

    const handleNextWithValidation = () => {
        form.validateFields(["property_type"]).then(({ property_type }) => {
            if (!property_type) {
                form.setFields([
                    {
                        name: "property_type",
                        errors: ["Please enter a property type"],
                    },
                ]);
            } else {
                nextStep();
            }
        });
    };

    useEffect(() => {
        setAutoCompletePolicyLines(allPolicyLines);
    }, [allPolicyLines]);

    return (
        <Container>
            {/* <Paragraph>
                Step {number}, What type of property do you want to submit
            </Paragraph> */}
            <Form.Item label="Property type" name="property_type" required>
                <AutoComplete
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleNextWithValidation();
                        }
                    }}
                    placeholder="Desktop Computer, DSLR Camera, Necklace"
                    autoFocus={!isTouchDevice}
                    onSearch={handlePolicyLineAutoComplete}
                    options={autoCompletePolicyLinesOptions}
                />
            </Form.Item>

            <Row>
                <Space>
                    <Button
                        onClick={() => {
                            handleNextWithValidation();
                        }}
                        type={isFormFilledOut ? "primary" : "default"}
                    >
                        {isLastStep ? "Submit" : "Go Next"}
                    </Button>
                </Space>
            </Row>

            <Row
                style={{
                    marginTop: 15,
                    display:
                        firstThreeRandomPolicyLines.length > 0 ? "" : "none",
                }}
            >
                <Paragraph
                    style={{ marginBottom: 0, marginRight: 10 }}
                    type="secondary"
                >
                    Try:
                </Paragraph>
                {firstThreeRandomPolicyLines.map((policyLine: PolicyLine) => {
                    return (
                        <Tag
                            key={policyLine.id}
                            style={{
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                form.setFieldValue(
                                    "property_type",
                                    policyLine.name
                                )
                            }
                        >
                            {policyLine.name}
                        </Tag>
                    );
                })}
            </Row>
        </Container>
    );
});

export default PolicyLineStep;
