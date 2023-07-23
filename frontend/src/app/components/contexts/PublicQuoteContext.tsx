import React, { createContext, useState } from "react";

export type PublicQuoteContextType = {
    quote: any;
    setQuote: (val: any) => void;
};

export const PublicQuoteContext = createContext<PublicQuoteContextType>({
    quote: null,
    setQuote: () => {},
});

function PublicQuoteProvider({ children }: { children: React.ReactNode }) {
    const [quote, setQuote] = useState<any>(null);

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
