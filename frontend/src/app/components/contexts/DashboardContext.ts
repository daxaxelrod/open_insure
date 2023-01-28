import React, { createContext } from "react";

export type DashboardContextType = {
    pageTitle: string;
    setPageTitle: (val: string) => void;
    // pageBreadCrumbs: []
};

export const DashboardContext = createContext<DashboardContextType>({
    pageTitle: "",
    setPageTitle: () => {},
});
