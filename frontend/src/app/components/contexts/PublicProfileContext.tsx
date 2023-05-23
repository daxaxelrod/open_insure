import React, { createContext, useMemo } from "react";
import { User } from "../../../redux/reducers/commonTypes";

export type PublicProfileContextType = {
    user: User | undefined;
};

export const PublicProfileContext = createContext<PublicProfileContextType>({
    user: undefined,
});

type PublicProfileProviderProps = PublicProfileContextType & {
    children: React.ReactNode;
};

function PublicProfileProvider({ children, user }: PublicProfileProviderProps) {
    const props = useMemo(
        () => ({
            user,
        }),
        [user]
    );

    return (
        <PublicProfileContext.Provider value={props}>
            {children}
        </PublicProfileContext.Provider>
    );
}

export default PublicProfileProvider;
