import React from 'react'
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { Typography } from 'antd';
import { Policy } from '../../../redux/reducers/commonTypes';

const { Title } = Typography;

export default function PolicyDetails() {

    let { id } = useParams();
    let policy = useAppSelector(state => state.policies.publicPolicies.find((p: Policy) => p.id === parseInt(id || "")));

    return (
        <div>
            <Title>Policy Details for {id}</Title>
            <div>{JSON.stringify(policy)}</div>
        </div>
    )
}
