import { parse } from '@tinyhttp/cookie'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import DatabaseSelect from '../components/DatabaseSelect'
import MediaUrlInput from '../components/Media/MediaUrlInput'
import PropertySelect from '../components/PropertySelect'
import { useNotionContext } from '../contexts/NotionContext'
import { login } from '../utils/authFunctions'

interface Props {
  accessToken: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  try {
    const parsedCookies = parse(req?.headers?.cookie || '')
    const cookieToken: string = parsedCookies?.accessToken
    const loginInfo = await login(cookieToken, '')
    return {
      props: {
        accessToken: loginInfo.accessToken,
      },
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        accessToken: null,
      },
    }
  }
}

const Dashboard: NextPage<Props> = (props) => {
  const { accessToken } = props
  const router = useRouter()
  const { setNotionToken } = useNotionContext()
  useEffect(() => {
    if (!accessToken) {
      router.push('/')
    } else {
      setNotionToken(accessToken)
    }
  }, [setNotionToken, router, accessToken])

  return (
    <div>
      <Link href="/api/logout">logout</Link>
      <DatabaseSelect />
      <PropertySelect />
      <MediaUrlInput />
    </div>
  )
}

export default Dashboard
