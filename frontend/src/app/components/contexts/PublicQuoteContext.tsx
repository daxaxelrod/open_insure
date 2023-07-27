// @ts-nocheck
import React, { createContext, useState } from "react";
import {
    GenericProperty,
    Risk,
    RiskSettings,
} from "../../../redux/reducers/commonTypes";

export interface PublicQuoteContextType {
    quote: Risk & {
        content_object: GenericProperty;
        risk_settings: RiskSettings;
    };
    setQuote: (val: any) => void;
}

export const PublicQuoteContext = createContext<PublicQuoteContextType>({
    quote: {
        id: null,
        content_object: {
            id: null,
            album: null,
            make: "Apple",
            model: null,
            condition: "new",
            market_value: 1200,
            has_screen_protector: false,
            has_case: false,
        },
        risk_score: 910,
        value_at_risk: 1092000,
        premium_amount: 910,
        underlying_insured_type: "cell_phone",
        object_id: null,
        created_at: null,
        updated_at: null,
        policy: null,
        user: null,
        content_type: 18,
        risk_settings: {
            id: null,
            conservative_factor: 30,
            cell_phone_peril_rate: 7,
            cell_phone_case_discount: 100,
            cell_phone_screen_protector_discount: 100,
            audio_equipment_peril_rate: 15,
            annual_discount_rate: 500,
            last_updated_at: null,
            policy: null,
            last_updated_by: null,
        },
    },
    setQuote: () => {},
});

function PublicQuoteProvider({ children }: { children: React.ReactNode }) {
    const [quote, setQuote] = useState<any>({
        id: null,
        content_object: {
            id: null,
            album: null,
            make: "Apple",
            model: null,
            condition: "new",
            market_value: 1200,
            has_screen_protector: false,
            has_case: false,
        },
        risk_score: 910,
        value_at_risk: 1092000,
        premium_amount: 910,
        underlying_insured_type: "cell_phone",
        object_id: null,
        created_at: null,
        updated_at: null,
        policy: null,
        user: null,
        content_type: 18,
        risk_settings: {
            id: null,
            conservative_factor: 30,
            cell_phone_peril_rate: 7,
            cell_phone_case_discount: 100,
            cell_phone_screen_protector_discount: 100,
            audio_equipment_peril_rate: 15,
            annual_discount_rate: 500,
            last_updated_at: null,
            policy: null,
            last_updated_by: null,
        },
    });

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
