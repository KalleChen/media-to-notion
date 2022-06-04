import { serialize } from '@tinyhttp/cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    serialize('accessToken', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
    })
  )
  res.redirect('/')
}
