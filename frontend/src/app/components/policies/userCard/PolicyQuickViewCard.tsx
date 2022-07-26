import { Card, Col, Row } from 'antd'
import React from 'react'
import { Policy } from '../../../../redux/reducers/commonTypes'
import CoverageRow from '../publicCard/CoverageRow'

export default function PolicyQuickViewCard({ policy }: { policy: Policy }) {
  return (
    <Card
      hoverable
      bordered={true} style={{ minWidth: 250, borderWidth: 3, borderRadius: 15 }}>
        <Row>
          <Col span={18}>
          <Row>
          {policy.name}
      </Row>
      <Row>
          {policy.coverage_type}
      </Row>
      <Row>
          Escrow address: {policy.pool_address}
          Escrow Balance: {policy.pool_balance}
      </Row>
      
      <Row>
          <CoverageRow policy={policy} />
      </Row>
          </Col>
          <Col span={6}>
             Premiums
             
          </Col>
        </Row>
      
  </Card>
  )
}
