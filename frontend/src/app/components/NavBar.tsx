import React from 'react'
import { Menu, MenuProps, Typography, Layout } from 'antd'
const { Header } = Layout;

const items1: MenuProps['items'] = [
  {
    key: '1',
    icon: 'home',
    theme: 'light',
    title: 'Home',
  }
]

const { Title } = Typography;

export default function NavBar() {
  return (
    <Header className="header" style={{background: '#f0f2f5'}} >
    <Typography>
      <Title>Open Insure</Title>
    </Typography>
  </Header>
  )
}
