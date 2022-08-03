import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import AudioEquipmentRiskForm from "./forms/AudioEquipmentRiskForm";
import PhoneRiskForm from "./forms/PhoneRiskForm";

export default function PolicyQuoteFormFactory({ policy }: { policy: Policy }) {
    switch (policy.underlying_insured_type) {
        case "cell_phone":
            return <PhoneRiskForm policy={policy} />;
        case "audio_equipment":
            return <AudioEquipmentRiskForm policy={policy} />;

        default:
            return null;
    }
}
