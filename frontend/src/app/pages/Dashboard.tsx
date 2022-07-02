import { isLoggedIn } from 'axios-jwt'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/join')
    }
  }, [])

  return (
    <div>Open Insure dashboard</div>
  )
}
