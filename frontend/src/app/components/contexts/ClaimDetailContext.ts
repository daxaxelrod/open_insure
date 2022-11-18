import React, { createContext } from "react";
import { Claim } from "../../../redux/reducers/commonTypes";

export type ClaimDetailContextType = {
    claim?: Claim;
    isClaimApproved: boolean;
};

export const ClaimDetailContext = createContext<ClaimDetailContextType>({
    isClaimApproved: false,
});
