import React, { useState } from 'react'
import { Button, Col, Input, Row, Typography } from 'antd';


import { useAppSelector } from '../../../redux/hooks';
import { Policy } from '../../../redux/reducers/commonTypes';
import {
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import CreatePolicyModal from './modals/CreatePolicyModal';
import PolicyCard from '../policies/publicCard/PolicyCard';


const { Title } = Typography;

export default function PolicyListSearch() {

  const [search, setSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false)
  const policies: Policy[] = useAppSelector(state => state.policies.publicPolicies);

  return (
    <div>
      <Row justify='space-between'>
        <Title level={3}>Find a policy</Title>
        <Col md={8} lg={6} sm={12} style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
          <Button style={{marginRight: 20}} 
                  type="primary"
                  onClick={() => setIsVisible(true)}
                  icon={<PlusOutlined />}>Create</Button>
          <Input 
            prefix={<SearchOutlined />}
            
            placeholder="Search" 
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {policies.map(policy => <PolicyCard key={policy.id} policy={policy} />)}
      </Row>
      <CreatePolicyModal isVisible={isVisible} setIsVisible={setIsVisible} />
    </div>
  )
}
