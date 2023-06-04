import React, { createContext, useMemo } from "react";
import { Pod, Policy, User } from "../../../redux/reducers/commonTypes";

export type PublicProfileContextType = {
    user: User | undefined;
    pods: Pod[] | undefined;
    policies: Policy[] | undefined;
};

export const PublicProfileContext = createContext<PublicProfileContextType>({
    user: undefined,
    pods: undefined,
    policies: undefined,
});

type PublicProfileProviderProps = PublicProfileContextType & {
    children: React.ReactNode;
};

function PublicProfileProvider({
    children,
    user,
    pods,
    policies,
}: PublicProfileProviderProps) {
    const props = useMemo(
        () => ({
            user,
            pods,
            policies,
        }),
        [pods, policies, user]
    );

    return (
        <PublicProfileContext.Provider value={props}>
            {children}
        </PublicProfileContext.Provider>
    );
}

export default PublicProfileProvider;
