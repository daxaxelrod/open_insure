import React from "react";
import { Alert } from "antd";
import { useAppSelector } from "../../../../redux/hooks";

export default function ClaimListErrorBar() {
    const error = useAppSelector((state) => state.claims.creationError);

    console.log(error);

    if (error) {
        return (
            <Alert
                message="You can't create a claim"
                description={
                    <div>
                        {error?.payload?.premiums?.message}
                        <ul>
                            {error?.payload?.premiums?.missed_premiums.map(
                                (e: string, idx: any) => (
                                    <li key={`missed-premium-${idx}`}>{e}</li>
                                )
                            )}
                        </ul>
                    </div>
                }
                type="error"
            />
        );
    } else {
        return null;
    }
}
