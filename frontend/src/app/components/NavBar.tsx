import React from 'react'
import { Menu, MenuProps, Typography, Layout } from 'antd'
const { Header } = Layout;

const loggedInOptions: MenuProps['items'] = [
  {
    key: '1',
    icon: 'home',
    theme: 'light',
    title: 'Home',
  }
]

const { Title } = Typography;

export default function NavBar() {
  const isLoggedIn = false;

  return (
    <Header className="header" style={{ background: '#f0f2f5', paddingTop: 10 }} >
      <Typography>
        <Title>Open Insure</Title>
      </Typography>
      <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} items={isLoggedIn ? loggedInOptions : []} />
    </Header>
  )
}
