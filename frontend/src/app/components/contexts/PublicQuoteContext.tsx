// @ts-nocheck
import React, { createContext, useState } from "react";
import {
    GenericProperty,
    Risk,
    RiskSettings,
} from "../../../redux/reducers/types/commonTypes";

export interface PublicQuoteContextType {
    quote: Risk & {
        content_object: GenericProperty;
        risk_settings: RiskSettings;
    };
    setQuote: (val: any) => void;
}

export const PublicQuoteContext = createContext<PublicQuoteContextType>({
    quote: null,
    setQuote: () => {},
});

function PublicQuoteProvider({ children }: { children: React.ReactNode }) {
    const [quote, setQuote] = useState<any>();

    const contextValue: PublicQuoteContextType = {
        quote,
        setQuote,
    };

    return (
        <PublicQuoteContext.Provider value={contextValue}>
            {children}
        </PublicQuoteContext.Provider>
    );
}

export default PublicQuoteProvider;
