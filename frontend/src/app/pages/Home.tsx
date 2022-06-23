import { Col, Row, Typography } from 'antd'
import Layout, { Content } from 'antd/lib/layout/layout'
import React from 'react'
import NavBar from '../components/NavBar'

export default function Home() {
  return (
    <Layout >
      <NavBar />
      <Layout>

      <Content>
      <Row>
        <Col span={12}>
          <Typography>
            <Typography.Title>Self insure with confidence</Typography.Title>
          </Typography> 
        </Col>
        <Col span={12}>
          <Typography>
            <Typography.Paragraph>Search for insurance policies</Typography.Paragraph>
            <Typography.Paragraph>Pay Premiums to escrow</Typography.Paragraph>
            <Typography.Paragraph>Vote democratically on Premiums</Typography.Paragraph>
          </Typography> 
        </Col>
      </Row>
      <Row>
      <Col span={12}>
          <Typography>
            <Typography.Title>How is open insure different</Typography.Title>
          </Typography> 
        </Col>
        <Col span={12}>
          <Typography>
            <Typography.Paragraph>We make money from a small monthly fee. Regardless if you have 1 policy or 100 policies, you pay a flat rate</Typography.Paragraph>
            <Typography.Paragraph>Completely Open Source</Typography.Paragraph>
          </Typography> 
        </Col>
      </Row>
      </Content>
      </Layout>
    </Layout>
  )
}
