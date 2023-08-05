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
import { PolicyLine } from "../../../../redux/reducers/commonTypes";
import { useAppSelector } from "../../../../redux/hooks";
const { Paragraph } = Typography;

type Props = {
    number: number;
    setAtSecondStep: (value: boolean) => void;
};

const Container = styled("div")`
    padding: 2.75rem 0.35rem;
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
`;

const PolicyLineStep: FC<Props> = memo(({ number, setAtSecondStep }) => {
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

    useEffect(() => {
        setAutoCompletePolicyLines(allPolicyLines);
    }, [allPolicyLines]);

    const autoCompletePolicyLinesOptions = useMemo(
        () =>
            autoCompletePolicyLines.map((policyLine: PolicyLine) => ({
                key: policyLine.id,
                value: policyLine.name,
            })),
        [autoCompletePolicyLines]
    );

    return (
        <Container>
            <Paragraph>
                Step {number}, What type of property do you want to submit
            </Paragraph>
            <Form.Item label="Property type" name={"make"}>
                <AutoComplete
                    placeholder="Desktop Computer, DSLR Camera, Necklace"
                    autoFocus
                    onSearch={handlePolicyLineAutoComplete}
                    options={autoCompletePolicyLinesOptions}
                />
            </Form.Item>

            <Row>
                <Space>
                    <Button onClick={previousStep}>
                        {isFirstStep ? "do nothing" : "Go back"}
                    </Button>
                    <Button onClick={nextStep}>
                        {isLastStep ? "Submit" : "Go Next"}
                    </Button>
                </Space>
            </Row>
        </Container>
    );
});

export default PolicyLineStep;
