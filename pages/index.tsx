import { parse, serialize } from '@tinyhttp/cookie'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAppContext } from '../contexts/AppContext'
import { login } from '../utils/authFunctions'
import { NOTION_CLIENT_ID } from '../utils/envValue'

interface Props {
  accessToken: string
  user: {
    [key: string]: string
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req, res } = context
  try {
    const parsedCookies = parse(req?.headers?.cookie || '')
    const cookieToken: string = parsedCookies?.accessToken
    const loginInfo = await login(cookieToken, query?.code)
    if (!loginInfo?.accessToken) {
      res.setHeader(
        'Set-Cookie',
        serialize('accessToken', '', {
          maxAge: 30 * 24 * 60 * 60,
          httpOnly: true,
          expires: new Date(0),
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          path: '/',
        })
      )
    } else {
      res.setHeader(
        'Set-Cookie',
        serialize('accessToken', loginInfo.accessToken, {
          maxAge: 30 * 24 * 60 * 60,
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          path: '/',
        })
      )
    }
    return {
      props: {
        ...loginInfo,
      },
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        user: null,
        accessToken: null,
      },
    }
  }
}

const Home: NextPage<Props> = (props) => {
  const { user, accessToken } = props
  const router = useRouter()
  const { setUser, setNotionToken } = useAppContext()
  useEffect(() => {
    if (accessToken && user) {
      setNotionToken(accessToken)
      setUser(user)
      router.push('/dashboard')
    } else {
      setNotionToken(null)
      setUser(null)
    }
  }, [accessToken, user, setNotionToken, setUser, router])
  const notionLoginUri = {
    pathname: 'https://api.notion.com/v1/oauth/authorize',
    query: {
      client_id: NOTION_CLIENT_ID,
      response_type: 'code',
    },
  }
  return (
    <div>
      <Head>
        <title>Media to Notion!</title>
        <meta
          name="description"
          content="A tool let you automatically add media information to notion database"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href={notionLoginUri}>Login by notion</Link>
    </div>
  )
}

export default Home
