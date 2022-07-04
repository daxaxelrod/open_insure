import React from 'react'
import { Policy } from '../../../../redux/reducers/commonTypes'

export default function Title({ policy } : { policy: Policy }) {
    
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'row'
    }}>
        <div>{policy.name}</div>
        <div>{policy?.pod?.members?.length}</div>
    </div>
  )
}
