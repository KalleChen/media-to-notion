import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import DatabaseSelect from '../components/DatabaseSelect'
import { useAppContext } from '../contexts/AppContext'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const { notionToken } = useAppContext()
  useEffect(() => {
    if (!notionToken) {
      router.push('/')
    }
  }, [notionToken, router])

  return (
    <div>
      hi
      <Link href="/api/logout">logout</Link>
      <DatabaseSelect />
    </div>
  )
}

export default Dashboard
