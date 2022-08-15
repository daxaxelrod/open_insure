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
    closeDrawer,
}: {
    policy: Policy;
    risk: Risk | null;
    closeDrawer: () => void;
}) {
    const dispatch = useAppDispatch();
    const updateRisk = (values: any) => {
        if (risk) {
            dispatch(patchRisk(policy.id, risk?.id, values));
        } else {
            console.log("Error: no risk");
        }
    };
    const riskPending = useAppSelector((state) => state.risk.modifyRiskPending);
    let availableInsuredAssetTypes: string[] = [];

    if (policy) {
        availableInsuredAssetTypes = policy?.available_underlying_insured_types;
    }
    const formLayout: any = {
        labelCol: {
            xs: { span: 5 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 14 },
            sm: { span: 8 },
        },
    };

    return (
        <div>
            <Spin spinning={riskPending}>
                <PolicyAssetCoverageSelection
                    types={availableInsuredAssetTypes}
                    risk={risk}
                    updateRisk={updateRisk}
                    formLayout={formLayout}
                />

                <PolicyQuoteFormFactory
                    policy={policy}
                    risk={risk}
                    updateRisk={updateRisk}
                    formLayout={formLayout}
                    closeDrawer={closeDrawer}
                />
            </Spin>
        </div>
    );
}
