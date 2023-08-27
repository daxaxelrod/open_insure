import React, { createContext, useMemo } from "react";
import {
    Claim,
    ClaimApproval,
    Pod,
    Policy,
    User,
} from "../../../redux/reducers/types/commonTypes";

export type PublicProfileContextType = {
    user: User | undefined;
    pods: Pod[] | undefined;
    policies: Policy[] | undefined;
    votes: ClaimApproval[] | undefined;
    onTimePremiums: number | undefined;
    totalPayments: number | undefined;
    totalPremiumsScheduled: number | undefined;
    claims: Claim[] | undefined;
};

export const PublicProfileContext = createContext<PublicProfileContextType>({
    user: undefined,
    pods: undefined,
    policies: undefined,
    votes: undefined,
    onTimePremiums: undefined,
    totalPayments: undefined,
    totalPremiumsScheduled: undefined,
    claims: undefined,
});

type PublicProfileProviderProps = PublicProfileContextType & {
    children: React.ReactNode;
};

function PublicProfileProvider({
    children,
    user,
    pods,
    policies,
    votes,
    onTimePremiums,
    totalPayments,
    totalPremiumsScheduled,
    claims,
}: PublicProfileProviderProps) {
    const props = useMemo(
        () => ({
            user,
            pods,
            policies,
            votes,
            onTimePremiums,
            totalPayments,
            totalPremiumsScheduled,
            claims,
        }),
        [
            claims,
            onTimePremiums,
            pods,
            policies,
            totalPayments,
            totalPremiumsScheduled,
            user,
            votes,
        ]
    );

    return (
        <PublicProfileContext.Provider value={props}>
            {children}
        </PublicProfileContext.Provider>
    );
}

export default PublicProfileProvider;
