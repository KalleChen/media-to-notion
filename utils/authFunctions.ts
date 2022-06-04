import { Client } from '@notionhq/client'
import axios from 'axios'

import { NOTION_CLIENT_ID, NOTION_CLIENT_SECRET } from '../utils/envValue'

interface NotionTokenResponse {
  access_token: string
  workspace_id: string
  workspace_name: string
  workspace_icon: string
  bot_id: string
  owner: {
    user: {
      [key: string]: string
    }
  }
}

export const getAccessToken = async (code: string): Promise<string> => {
  try {
    const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token'
    const res = await axios.post<NotionTokenResponse>(
      NOTION_TOKEN_URL,
      {
        grant_type: 'authorization_code',
        code,
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
      return ''
    }
    return res?.data?.access_token
  } catch (e) {
    console.log(e)
    return ''
  }
}

export const getNotionUser = async (accessToken: string) => {
  try {
    const notion = new Client({ auth: accessToken })

    const res = await notion.users.me({})
    if (res?.type === 'bot' && res?.bot?.owner?.type === 'user') {
      return res?.bot?.owner?.user
    }
    return null
  } catch (e) {
    console.log(e)
    return null
  }
}

export const login = async (
  cookieToken: string,
  queryToken: string | string[] | undefined
) => {
  let user = await getNotionUser(cookieToken)
  let accessToken = cookieToken
  if (!user) {
    if (typeof queryToken !== 'string') {
      return {
        user: null,
        accessToken: null,
      }
    }
    accessToken = await getAccessToken(queryToken)
    user = await getNotionUser(accessToken)
    if (!user) {
      return {
        user: null,
        accessToken: null,
      }
    }
  }
  return {
    user,
    accessToken,
  }
}
