import { Typography } from 'antd'
import React from 'react'
import { maybePluralize } from '../../../utils/stringUtils'

const { Title } = Typography

export default function PremiumDisplay({ amount, frequency }: { amount: number, frequency: number }) {
  return (
    <div style={{flexDirection: 'row', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <Title level={2} style={{lineHeight: 1}}>${amount}</Title>
      <Title level={5} style={{lineHeight: 1}}>/ every {frequency === 1 ? '' : `${frequency} `} {maybePluralize(frequency, "month")}</Title>
    </div>
  )
}
