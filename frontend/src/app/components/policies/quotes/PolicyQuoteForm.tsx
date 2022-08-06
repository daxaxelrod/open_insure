import React, { useState } from "react";
import { Divider, Steps } from "antd";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import PolicyQuoteFormFactory from "./PolicyQuoteFormFactory";

const { Step } = Steps;

export default function PolicyQuoteForm({
    policy,
    risk,
}: {
    policy: Policy;
    risk: Risk | null;
}) {
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    return (
        <div>
            <Steps progressDot current={current}>
                <Step title="Waiting" description="This is a description." />
                <Step
                    title="In Progress"
                    description="This is a description."
                />
                <Step title="Finished" description="This is a description." />
            </Steps>
            {current === 1 && (
                <PolicyQuoteFormFactory policy={policy} risk={risk} />
            )}
        </div>
    );
}
