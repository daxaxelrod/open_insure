import React from 'react'
import { Col, Input, Row, Typography } from 'antd';
import { useAppSelector } from '../../../redux/hooks';
import { Policy } from '../../../redux/reducers/commonTypes';
import PolicyCard from '../policies/card/PolicyCard';
import {
  SearchOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function PolicyListSearch() {

  const [search, setSearch] = React.useState('');
  const policies: Policy[] = useAppSelector(state => state.policies.policies);

  return (
    <div>
      <Row style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
      }}>
        <Title>Policies</Title>
        <Col span={6}>
        
          <Input 
            prefix={<SearchOutlined />}
            size="large"
            placeholder="Search" 
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            />
        </Col>
        
        
      </Row>
      <Row gutter={[16, 16]}>
        {policies.map(policy => <PolicyCard key={policy.id} policy={policy} />)}
      </Row>
    </div>
  )
}
