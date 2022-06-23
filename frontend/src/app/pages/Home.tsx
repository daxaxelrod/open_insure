import React from 'react'
import { Button, Col, Row, Typography } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import NavBar from '../components/NavBar'
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content>
          <Row>
            <Col span={12}>
              <Typography>
                <Title level={2}>Self insure with confidence</Title>
              </Typography>
            </Col>
            <Col span={12}>
              <Typography>
                <Paragraph>Search for insurance policies</Paragraph>
                <Paragraph>Pay Premiums to escrow</Paragraph>
                <Paragraph>Vote democratically on Premiums</Paragraph>
              </Typography>
              <Typography>
                <Paragraph>
                  Want to know more?
                </Paragraph>
              </Typography>
              <Link to={"/join"}>
                <Button type="primary" shape="round" size={"large"} >
                  Register
                </Button>
              </Link>
            </Col>
            
          </Row>
          
          <Row>
            <Col span={12}>
              <Typography>
                <Title level={2}>How is open insure different</Title>
              </Typography>
            </Col>
            <Col span={12}>
              <Typography>
                <Paragraph>We make money from a small monthly fee. Regardless if you have 1 policy or 100 policies, you pay a flat rate</Paragraph>
                <Paragraph>Completely Open Source</Paragraph>
              </Typography>
            </Col>
          </Row>
        </Content>
      </Layout>
  )
}
