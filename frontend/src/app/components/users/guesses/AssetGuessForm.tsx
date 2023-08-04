import React, { useEffect } from "react";
import { useAppDispatch } from "../../../../redux/hooks";

export default function AssetGuessForm() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getGuessPolicyLinesList());
    }, []);

    return (
        <div>
            <h1>Asset Guess Form</h1>
        </div>
    );
}
