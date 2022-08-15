import React from "react";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import AudioEquipmentRiskForm from "./riskTypeForms/AudioEquipmentRiskForm";
import PhoneRiskForm from "./riskTypeForms/PhoneRiskForm";

export default function PolicyQuoteFormFactory({
    policy,
    risk,
    updateRisk,
    formLayout,
    closeDrawer,
}: {
    policy: Policy;
    risk: Risk | null;
    updateRisk: (values: any) => void;
    formLayout: any;
    closeDrawer: () => void;
}) {
    switch (risk?.underlying_insured_type) {
        case "cell_phone":
            return (
                <PhoneRiskForm
                    policy={policy}
                    updateRisk={updateRisk}
                    formLayout={formLayout}
                    closeDrawer={closeDrawer}
                />
            );
        case "audio_equipment":
            return (
                <AudioEquipmentRiskForm
                    policy={policy}
                    updateRisk={updateRisk}
                    formLayout={formLayout}
                    closeDrawer={closeDrawer}
                />
            );
        default:
            return <div>Select a insured type</div>;
    }
}
