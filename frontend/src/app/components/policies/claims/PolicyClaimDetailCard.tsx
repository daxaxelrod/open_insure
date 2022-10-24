import { Card } from "antd";
import React from "react";
import { Claim } from "../../../../redux/reducers/commonTypes";

type props = {
    claim: Claim;
};

export default function PolicyClaimDetailCard({ claim }: props) {
    return (
        <Card>
            <div>Claim #{claim.id}</div>
        </Card>
    );
}
