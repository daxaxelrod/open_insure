import React from "react";
import { Policy, Risk } from "../../../../redux/reducers/types/commonTypes";
import AudioEquipmentRiskForm from "./riskTypeForms/AudioEquipmentRiskForm";
import PhoneRiskForm from "./riskTypeForms/PhoneRiskForm";

export default function PolicyQuoteFormFactory({
    editable = true,
    policy,
    risk,
    updateRisk,
    formLayout,
    closeDrawer,
}: {
    editable: boolean;
    policy: Policy;
    risk: Risk | null;
    updateRisk: (values: any, fetchQuote?: boolean) => void;
    formLayout: any;
    closeDrawer: () => void;
}) {
    switch (risk?.underlying_insured_type) {
        case "cell_phone":
            return (
                <PhoneRiskForm
                    editable={editable}
                    policy={policy}
                    updateRisk={updateRisk}
                    formLayout={formLayout}
                    closeDrawer={closeDrawer}
                />
            );
        case "audio_equipment":
            return (
                <AudioEquipmentRiskForm
                    editable={editable}
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
