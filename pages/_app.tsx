import '../styles/globals.css'

import type { AppProps } from 'next/app'

import { AppContextProvider } from '../contexts/AppContext'
import { MediaContextProvider } from '../contexts/MediaContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <MediaContextProvider>
        <Component {...pageProps} />
      </MediaContextProvider>
    </AppContextProvider>
  )
}

export default MyApp
