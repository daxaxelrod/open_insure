import * as React from "react";
import { useWizard } from "react-use-wizard";
import styled from "styled-components";
import { Button, Col, Grid, Input, Row, Space, Typography } from "antd";

type Props = {
    number: number;
    withCallback?: boolean;
};

const Container = styled("div")`
    padding: 2.75rem 0.35rem;
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
`;

const Step: React.FC<Props> = React.memo(({ number, withCallback = true }) => {
    const {
        isLoading,
        handleStep,
        previousStep,
        nextStep,
        isLastStep,
        isFirstStep,
    } = useWizard();

    if (withCallback) {
        handleStep(() => {
            alert("Going to next step");
        });
    }

    return (
        <Container>
            <p>(Sync) Step {number}</p>

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

export default Step;
