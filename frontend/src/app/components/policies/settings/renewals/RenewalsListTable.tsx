import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getRenewals } from "../../../../../redux/actions/renewals";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {
    Policy,
    Renewal,
    User,
} from "../../../../../redux/reducers/commonTypes";

export default function RenewalsListTable({ policy }: { policy: Policy }) {
    const dispatch = useAppDispatch();
    const renewals: Renewal[] =
        useAppSelector((state) => state.policies.renewals?.[policy.id]) || [];
    const users: Record<string, User> = useAppSelector(
        (state) => state.users.users
    );

    const columns: ColumnsType<Renewal> = [
        {
            title: "Created",
            render: (text, renewal: Renewal) => {
                return <div>{renewal.created_at}</div>;
            },
            dataIndex: "created_at",
            key: "created_at",
        },
        {
            title: "Extension Length",
            render: (text: number) => {
                return <div>{text} months</div>;
            },
            dataIndex: "months_extension",
            key: "months_extension",
        },
        {
            title: "Initiator",
            render: (text, renewal: Renewal) => {
                let initiator = renewal.initiator;
                let user = users?.[initiator];
                if (user.id) {
                    return (
                        <Link to={`/members/${user.id}`}>
                            {user.first_name} {user.last_name}
                        </Link>
                    );
                } else {
                    <Link to={`/members/${initiator}`}>
                        User Id #{initiator}
                    </Link>;
                }
            },
            dataIndex: "initiator",
            key: "initiator",
        },
    ];

    useEffect(() => {
        if (policy?.id) {
            dispatch(getRenewals(policy?.id));
        }
    }, [policy?.id]);

    return <Table dataSource={renewals} columns={columns} />;
}
