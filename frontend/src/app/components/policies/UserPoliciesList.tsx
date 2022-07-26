import { Col } from "antd";
import React from "react";
import { Policy } from "../../../redux/reducers/commonTypes";
import PolicyQuickViewCard from "./userCard/PolicyQuickViewCard";

export default function UserPoliciesList({ policies }: { policies: Policy[] }) {
    return (
        <Col sm={12} md={8} lg={6}>
            {policies.map((policy) => (
                <PolicyQuickViewCard key={policy.id} policy={policy} />
            ))}
        </Col>
    );
}
