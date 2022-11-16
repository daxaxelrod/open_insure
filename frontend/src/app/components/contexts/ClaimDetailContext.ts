import React, { createContext } from "react";
import { Claim } from "../../../redux/reducers/commonTypes";

export type ClaimDetailContextType = {
    claim: Claim | undefined;
};

export const ClaimDetailContext = createContext<ClaimDetailContextType | null>(
    null
);
