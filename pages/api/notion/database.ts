import { Client } from '@notionhq/client'
import type { SearchResponse } from '@notionhq/client/build/src/api-endpoints'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ExtendedNextApiRequest extends NextApiRequest {
  query: {
    accessToken: string
  }
}

export type DatabaseResponse = SearchResponse

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<DatabaseResponse | { error: string }>
) {
  const accessToken: string = req?.query?.accessToken
  if (!accessToken) {
    res.status(400).json({ error: 'Missing access token' })
  }
  const notion = new Client({ auth: accessToken })
  const response = await notion.search({
    filter: {
      property: 'object',
      value: 'database',
    },
    sort: {
      direction: 'ascending',
      timestamp: 'last_edited_time',
    },
  })
  return res.status(200).json(response)
}
