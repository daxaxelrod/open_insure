import React from "react";
import { Spin } from "antd";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import PolicyQuoteFormFactory from "./PolicyQuoteFormFactory";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import PolicyAssetCoverageSelection from "./PolicyAssetCoverageSelection";
import { patchRisk } from "../../../../redux/actions/risk";

export default function PolicyQuoteForm({
    editable = true,
    policy,
    risk,
    closeDrawer,
}: {
    editable?: boolean;
    policy: Policy;
    risk: Risk | null;
    closeDrawer: () => void;
}) {
    const dispatch = useAppDispatch();
    const updateRisk = (values: any) => {
        if (!editable) {
            return;
        }
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
                    editable={editable}
                    types={availableInsuredAssetTypes}
                    risk={risk}
                    updateRisk={updateRisk}
                    formLayout={formLayout}
                />

                <PolicyQuoteFormFactory
                    editable={editable}
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
