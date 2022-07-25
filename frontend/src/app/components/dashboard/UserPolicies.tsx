import React, { useState } from 'react'
import { Row, Typography, Col, Input,  } from 'antd';
import {
  SearchOutlined
} from '@ant-design/icons';

const { Title } = Typography;

export default function UserPolicies() {


  const [search, setSearch] = useState('');

  return (
    <div>
      <Row justify='space-between'>
        <Title level={3}>My Policies</Title>
        <Col md={8} lg={6} sm={12} style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
          <Input 
            prefix={<SearchOutlined />}
            
            placeholder="Search" 
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            />
        </Col>
      </Row>
    </div>
  )
}
