import React, { useState } from 'react'
import { Button, Col, Input, Row, Typography } from 'antd';


import { useAppSelector } from '../../../redux/hooks';
import { Policy } from '../../../redux/reducers/commonTypes';
import PolicyCard from '../policies/card/PolicyCard';
import {
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import CreatePolicyModal from './modals/CreatePolicyModal';


const { Title } = Typography;

export default function PolicyListSearch() {

  const [search, setSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false)
  const policies: Policy[] = useAppSelector(state => state.policies.policies);

  return (
    <div>
      <Row style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
      }}>
        <Title>Policies</Title>
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
