import React, { useEffect } from "react";
import { Avatar, Button, Row, Table, Typography, notification } from "antd";

import { Policy, User } from "../../../../redux/reducers/commonTypes";
import { ColumnsType } from "antd/lib/table";
import { CheckOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { Link } from "react-router-dom";
import { getPodById } from "../../../../redux/actions/pods";
const { Title } = Typography;

interface MemberRowType extends User {
    key: React.Key;
}

export default function MembersTable({ policy }: { policy: Policy }) {
    const dispatch = useAppDispatch();
    const pod = useAppSelector((state) =>
        state.pods.pods.find(
            (pod) => [policy.pod?.id, policy?.pod].indexOf(pod.id) > -1
        )
    );
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    useEffect(() => {
        if (policy && typeof policy.pod === "number") {
            // get the pod for the policy
            dispatch(getPodById(policy.pod));
        }
    }, [policy]);

    const emailEveryone = () => {
        let emails = members.map((m) => m.email);

        // mailto is unreliable, so we'll use a copy to clipboard + alert
        // let mailLink = `mailto:to=${emails.join("&to=");}`;
        // window.open(mailLink, "_blank");
        navigator.clipboard.writeText(emails.join(";"));

        notification.success({
            message: "All emails copied to clipboard",
        });
    };

    const members: MemberRowType[] =
        policy?.pod?.members?.map((m) => ({
            ...m,
            key: m.id,
        })) ||
        pod?.members?.map((m: User) => ({
            ...m,
            key: m.id,
        })) ||
        [];

    const isMember = members?.find((member) => {
        return member.id === currentUser.id;
    });

    const columns: ColumnsType<MemberRowType> = [
        {
            title: "Name",
            width: "20rem",
            render: (text, record: MemberRowType) => (
                <Link to={`/members/${record.id}`}>
                    {record.picture && (
                        <Avatar
                            src={record.picture}
                            size={"default"}
                            style={{ marginRight: 6 }}
                        />
                    )}
                    <span>
                        {record.first_name} {record.last_name}
                    </span>
                </Link>
            ),
        },
        {
            title: "Email",
            width: "20rem",
            render: (text, record) => record.email,
        },
        {
            title: "Verified Email",
            dataIndex: "verified_email",
            render: (text) => <div>{text ? <CheckOutlined /> : null}</div>,
        },
        {
            title: () => (
                <Row justify="end">
                    {isMember && (
                        <Button type="primary" onClick={emailEveryone}>
                            Email Eveyone
                        </Button>
                    )}
                </Row>
            ),
            render: (text) => null,
        },
    ];
    return (
        <div style={{ marginBottom: ".5rem" }}>
            <Title level={4}>Policy Members</Title>
            <Table dataSource={members} columns={columns} />
        </div>
    );
}
