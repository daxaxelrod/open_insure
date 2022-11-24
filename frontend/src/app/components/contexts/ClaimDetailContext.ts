import React, { createContext } from "react";
import { Claim, Policy } from "../../../redux/reducers/commonTypes";

export type ClaimDetailContextType = {
    claim?: Claim;
    policy?: Policy;
    isClaimApproved: boolean;
};

export const ClaimDetailContext = createContext<ClaimDetailContextType>({
    isClaimApproved: false,
});
