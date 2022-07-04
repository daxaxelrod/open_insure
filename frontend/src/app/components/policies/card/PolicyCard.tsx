import React from 'react'
import { Card, Col, Dropdown, Menu } from 'antd'
import { Policy } from '../../../../redux/reducers/commonTypes'
import { Link } from 'react-router-dom'
import Title from './Title';

const menu = ( // eh not sure if we should keep this, kinda hidden from the user
    <Menu
        items={[
            {
                label: 'Share Link (Not Implemented)',
                key: '1',
                onClick: () => {
                    console.log('Share Link');
                    return true
                }
            },
            {
                label: 'Join Group (Not implemented)',
                key: '2',
                onClick: () => {
                    console.log('Join Group');
                    return true;
                }
            },
        ]}
    />
);


export default function PolicyCard({ policy }: { policy: Policy }) {
    return (

        <Col span={8}>
            <div style={{
                padding: 20,
            }}>
                <Link to={`policy/${policy.id}`}>
                    <Dropdown overlay={menu} trigger={['contextMenu']}>
                        <Card
                            title={<Title policy={policy} />}
                            hoverable
                            bordered={true} style={{ minWidth: 250, borderWidth: 3, borderRadius: 15 }}>
                            {JSON.stringify(policy)}
                        </Card>
                    </Dropdown>
                </Link>
            </div>
        </Col>
    )
}
