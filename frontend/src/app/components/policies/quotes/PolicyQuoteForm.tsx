import React, { useState } from "react";
import { Divider, Steps } from "antd";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import PolicyQuoteFormFactory from "./PolicyQuoteFormFactory";
import { useAppDispatch } from "../../../../redux/hooks";
import PolicyAssetCoverageSelection from "./PolicyAssetCoverageSelection";
import { patchRisk } from "../../../../redux/actions/risk";

const { Step } = Steps;

export default function PolicyQuoteForm({
    policy,
    risk,
}: {
    policy: Policy;
    risk: Risk | null;
}) {
    const dispatch = useAppDispatch();
    const updateRisk = (values: any) => {
        if (risk) {
            dispatch(patchRisk(risk?.id, values));
        } else {
            console.log();
        }
    };

    let availableInsuredAssetTypes =
        policy.available_underlying_insured_types.split(",");
    let hasMoreThanOneAvailableAssetClassCoverage =
        availableInsuredAssetTypes.length > 1;

    return (
        <div>
            {/* <Steps progressDot current={current}>
                <Step title="Waiting" description="This is a description." />
                <Step
                    title="In Progress"
                    description="This is a description."
                />
                <Step title="Finished" description="This is a description." />
            </Steps> */}
            {hasMoreThanOneAvailableAssetClassCoverage && (
                <PolicyAssetCoverageSelection
                    types={availableInsuredAssetTypes}
                    risk={risk}
                    updateRisk={updateRisk}
                />
            )}

            <PolicyQuoteFormFactory
                policy={policy}
                risk={risk}
                updateRisk={updateRisk}
            />
        </div>
    );
}
