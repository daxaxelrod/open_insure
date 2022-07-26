import React from 'react'
import { Card, Col, Dropdown, Menu, Row } from 'antd'
import { Policy } from '../../../../redux/reducers/commonTypes'
import { Link } from 'react-router-dom'
import Title from './Title';
import PolicyIcon from './PolicyIcon';
import PremiumDisplay from './ PremiumDisplay';
import CoverageRow from './CoverageRow';


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
                    <Dropdown overlay={menu} trigger={[]}>
                        <Card
                            title={<Title policy={policy} />}
                            hoverable
                            bordered={true} style={{ minWidth: 250, borderWidth: 3, borderRadius: 15 }}>
                            <Row>
                                <Col span={6} >
                                    <PolicyIcon type={policy.coverage_type} />
                                </Col>
                                <Col span={18}>
                                    <PremiumDisplay amount={policy.premium_amount} frequency={policy.premium_payment_frequency} />
                                </Col>
                            </Row>
                            <Row>
                                <CoverageRow policy={policy} />
                            </Row>
                        </Card>
                    </Dropdown>
                </Link>
            </div>
        </Col>
    )
}
