import React, { createContext } from "react";
import { Claim, Policy, User } from "../../../redux/reducers/commonTypes";

export type ClaimDetailContextType = {
    claim?: Claim;
    policy?: Policy;
    claimant?: User;
    isClaimApproved: boolean;
};

export const ClaimDetailContext = createContext<ClaimDetailContextType>({
    isClaimApproved: false,
});
