import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { ReactComponent } from "../../../../assets/images/policy-detail/undraw_visual_data_re_mxxo.svg";

export default function PolicyEscrowBalanceChart({
    policy,
    isMember,
}: {
    policy: Policy;
    isMember?: boolean;
}) {
    return (
        <div>
            <ReactComponent style={{ height: "100%", width: 140 }} />
            <div>Escrow Balance not reported</div>
        </div>
    );
}
