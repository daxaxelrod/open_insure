import React, { useState } from "react";
import { Divider, PageHeader, Spin, Steps } from "antd";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import PolicyQuoteFormFactory from "./PolicyQuoteFormFactory";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import PolicyAssetCoverageSelection from "./PolicyAssetCoverageSelection";
import { patchRisk } from "../../../../redux/actions/risk";

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
            console.log("Error patching risk");
        }
    };
    const riskPending = useAppSelector((state) => state.risk.modifyRiskPending);
    let availableInsuredAssetTypes: string[] = [];
    let hasMoreThanOneAvailableAssetClassCoverage;

    if (policy) {
        availableInsuredAssetTypes = policy?.available_underlying_insured_types;
        hasMoreThanOneAvailableAssetClassCoverage =
            availableInsuredAssetTypes?.length > 1;
    }

    return (
        <div>
            <Spin spinning={riskPending}>
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
                {JSON.stringify(risk)}
            </Spin>
        </div>
    );
}
