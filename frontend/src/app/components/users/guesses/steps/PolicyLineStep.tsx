import React, { FC, memo, useEffect, useMemo, useState } from "react";
import { useWizard } from "react-use-wizard";
import styled from "styled-components";
import {
    AutoComplete,
    Button,
    Col,
    Form,
    FormInstance,
    Grid,
    Input,
    Row,
    Space,
    Typography,
} from "antd";
import { PolicyLine } from "../../../../../redux/reducers/commonTypes";
import { useAppSelector } from "../../../../../redux/hooks";
const { Paragraph } = Typography;

type Props = {
    number: number;
    setAtSecondStep: (value: boolean) => void;
    form: FormInstance;
};

const Container = styled("div")`
    padding: 2.75rem 0.35rem;
    flex-direction: column;
`;

const PolicyLineStep: FC<Props> = memo(({ number, setAtSecondStep, form }) => {
    const { previousStep, nextStep, isLastStep, isFirstStep, handleStep } =
        useWizard();

    const allPolicyLines = useAppSelector((state) => state.actuary.policyLines);
    const [autoCompletePolicyLines, setAutoCompletePolicyLines] = useState<
        PolicyLine[]
    >([]);

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

    useEffect(() => {
        setAutoCompletePolicyLines(allPolicyLines);
    }, [allPolicyLines]);

    return (
        <Container>
            {/* <Paragraph>
                Step {number}, What type of property do you want to submit
            </Paragraph> */}
            <Form.Item label="Property type" name="property_type">
                <AutoComplete
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            nextStep();
                        }
                    }}
                    placeholder="Desktop Computer, DSLR Camera, Necklace"
                    autoFocus
                    onSearch={handlePolicyLineAutoComplete}
                    options={autoCompletePolicyLinesOptions}
                />
            </Form.Item>

            <Form.Item></Form.Item>

            <Row>
                <Space>
                    <Button
                        onClick={nextStep}
                        type={isFormFilledOut ? "primary" : "default"}
                    >
                        {isLastStep ? "Submit" : "Go Next"}
                    </Button>
                </Space>
            </Row>
        </Container>
    );
});

export default PolicyLineStep;
