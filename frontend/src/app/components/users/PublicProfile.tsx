import React from "react";
import { useParams } from "react-router-dom";
// import { useAppSelector } from "../../../redux/hooks";
import { Typography } from "antd";

const { Title } = Typography;

export default function PublicProfile({}) {
    let { id } = useParams();

    return <Title>Public Profile for user {id}</Title>;
}
