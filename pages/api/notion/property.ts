import { Client } from '@notionhq/client'
import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ExtrendedNextApiRequest extends NextApiRequest {
  query: {
    id: string
    accessToken: string
  }
}

export type PropertyResnponse = GetDatabaseResponse['properties']

export default async function handler(
  req: ExtrendedNextApiRequest,
  res: NextApiResponse<PropertyResnponse | { error: string }>
) {
  const { id, accessToken } = req.query
  if (!id || !accessToken) {
    res.status(400).json({
      error: 'Missing id or accessToken',
    })
  }
  const notion = new Client({ auth: accessToken })
  const response = await notion.databases.retrieve({
    database_id: id,
  })
  res.status(200).json(response.properties)
}
