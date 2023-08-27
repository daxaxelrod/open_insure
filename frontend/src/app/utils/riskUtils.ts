import { Risk } from "../../redux/reducers/types/commonTypes";

export function getAssetTypeName(risk: Risk) {
    switch (risk?.underlying_insured_type) {
        case "cell_phone":
            return "Phone";
        case "audio_equipment":
            return "Audio Equipment";
        default:
            return "";
    }
}
