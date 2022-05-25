import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
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
    </div>
  )
}

export default Home
