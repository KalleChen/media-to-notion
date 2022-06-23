import '../styles/globals.css'

import type { AppProps } from 'next/app'

import { MediaContextProvider } from '../contexts/MediaContext'
import { NotionContextProvider } from '../contexts/NotionContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotionContextProvider>
      <MediaContextProvider>
        <Component {...pageProps} />
      </MediaContextProvider>
    </NotionContextProvider>
  )
}

export default MyApp
