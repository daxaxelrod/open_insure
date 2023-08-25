import { FC, memo, useEffect, useMemo, useState } from "react";
import { useWizard } from "react-use-wizard";
import styled from "styled-components";
import { AutoComplete, Button, Form, Row, Space } from "antd";
import { PolicyLine } from "../../../../../redux/reducers/types/actuaryTypes";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { getActuarialStatsForPolicyLine } from "../../../../../redux/actions/guesses";

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
                            e.preventDefault();
                            nextStep();
                        }
                    }}
                    placeholder="Desktop Computer, DSLR Camera, Necklace"
                    autoFocus
                    onSearch={handlePolicyLineAutoComplete}
                    options={autoCompletePolicyLinesOptions}
                />
            </Form.Item>

            <Row>
                <Space>
                    <Button
                        disabled={!isFormFilledOut}
                        onClick={() => nextStep()}
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