import axios from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAppContext } from '../contexts/AppContext'

interface NotionTokenResponse {
  access_token: string
  workspace_id: string
  workspace_name: string
  workspace_icon: string
  bot_id: string
  owner: {
    [key: string]: string
  }
}

interface Props {
  accessToken: string
  user: {
    [key: string]: string
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token'
  const NOTION_CLIENT_ID: string =
    process.env.NEXT_PUBLIC_NOTION_CLIENT_ID || ''
  const NOTION_CLIENT_SECRET: string =
    process.env.NEXT_PUBLIC_NOTION_CLIENT_SECRET || ''
  const { query } = context
  if (!query?.code) {
    return {
      props: {
        user: null,
        accessToken: null,
      },
    }
  }
  try {
    const res = await axios.post<NotionTokenResponse>(
      NOTION_TOKEN_URL,
      {
        grant_type: 'authorization_code',
        code: query.code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`,
            'utf8'
          ).toString('base64')}`,
        },
      }
    )
    if (res.status !== 200) {
      return {
        props: {
          user: null,
          accessToken: null,
        },
      }
    }
    return {
      props: {
        user: res?.data?.owner.user,
        accessToken: res?.data?.access_token,
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
  const { setUser, setNotionToken, notionToken } = useAppContext()
  useEffect(() => {
    if (notionToken) {
      router.push('/dashboard')
    }
    if (accessToken) {
      setNotionToken(accessToken)
      setUser(user)
      router.push('/dashboard')
    }
  }, [accessToken, user, setNotionToken, setUser, notionToken, router])
  const NOTION_CLIENT_ID: string =
    process.env.NEXT_PUBLIC_NOTION_CLIENT_ID || ''
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
