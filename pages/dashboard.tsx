import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAppContext } from '../contexts/AppContext'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const { notionToken } = useAppContext()
  useEffect(() => {
    if (!notionToken) {
      router.push('/')
    }
  }, [notionToken, router])

  return <div>hi</div>
}

export default Dashboard
