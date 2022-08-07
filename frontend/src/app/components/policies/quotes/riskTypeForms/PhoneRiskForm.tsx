import React from "react";
import { Policy } from "../../../../../redux/reducers/commonTypes";

export default function PhoneRiskForm({
    policy,
    updateRisk,
}: {
    policy: Policy;
    updateRisk: (values: any) => void;
}) {
    return <div>PhoneRiskForm</div>;
}
