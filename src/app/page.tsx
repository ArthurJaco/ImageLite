'use client'

import { useEffect, useState } from 'react'
import {useAuth} from '@/resources'
import LoginPage from './login/page'
import GaleriaPage from './gallery/page'


export default function Home() {
  const [authenticated, setAuthenticated] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    setAuthenticated(useAuth().isSessionValid())
    setSessionChecked(true)
  }, [])

  if (!sessionChecked || !authenticated) return <LoginPage />
  return <GaleriaPage />
}
