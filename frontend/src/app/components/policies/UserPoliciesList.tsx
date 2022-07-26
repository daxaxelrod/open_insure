import React from 'react'
import { Policy } from '../../../redux/reducers/commonTypes'
import PolicyQuickViewCard from './userCard/PolicyQuickViewCard'

export default function UserPoliciesList({ policies } : { policies: Policy[] }) {
  return <>{policies.map((policy) => <PolicyQuickViewCard key={policy.id} policy={policy} />)}</>
     
  
}
