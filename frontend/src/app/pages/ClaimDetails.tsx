import React from "react";
import { Typography } from "antd";
import { useParams } from "react-router-dom";

const { Title } = Typography;

export default function ClaimDetails() {
    const { id, claimId } = useParams();

    return <div>ClaimDetails for claim id {claimId}</div>;
}
