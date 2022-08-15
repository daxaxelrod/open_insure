import React from "react";
import { Policy } from "../../../../../redux/reducers/commonTypes";

export default function AudioEquipmentRiskForm({
    policy,
    updateRisk,
    formLayout,
    closeDrawer,
}: {
    policy: Policy;
    updateRisk: (values: any) => void;
    formLayout: any;
    closeDrawer: () => void;
}) {
    return <div>AudioEquipmentRiskForm</div>;
}
