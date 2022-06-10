import axios from 'axios'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { IMDB_API_KEY } from '../utils/envValue'

interface Props {
  children: React.ReactNode
}

export interface MediaContextInterface {
  medias: Record<string, string>[]
  searchMedia: (query: string) => void
  selectedMedia: Record<
    string,
    string | string[] | Record<string, string>[]
  > | null
  selectedMediaId: string | null
  setSelectedMediaId: (id: string) => void
}

const initialValue: MediaContextInterface = {
  medias: [],
  searchMedia: () => {},
  selectedMedia: null,
  selectedMediaId: null,
  setSelectedMediaId: () => {},
}

const MediaContext = createContext<MediaContextInterface>(initialValue)

export const MediaContextProvider: React.FC<Props> = ({ children }) => {
  // states
  const [medias, setMedias] = useState<MediaContextInterface['medias']>([])
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] =
    useState<MediaContextInterface['selectedMedia']>(null)

  // functions
  const searchMedia = useCallback(async (query: string) => {
    const { data } = await axios.get<
      Record<string, string | Record<string, string>[]>
    >(`https://imdb-api.com/en/API/Search/${IMDB_API_KEY}/${query}`)
    if (Array.isArray(data.results)) {
      setMedias(data.results)
    }
  }, [])
  const fetchMediaDetail = useCallback(async () => {
    if (!selectedMediaId) return
    const { data } = await axios.get<MediaContextInterface['selectedMedia']>(
      `https://imdb-api.com/en/API/Title/${IMDB_API_KEY}/${selectedMediaId}`
    )
    setSelectedMedia(data)
  }, [selectedMediaId])

  // effects
  useEffect(() => {
    fetchMediaDetail()
  }, [fetchMediaDetail])

  const contextValues = {
    medias,
    searchMedia,
    selectedMedia,
    selectedMediaId,
    setSelectedMediaId,
  }
  return (
    <MediaContext.Provider value={contextValues}>
      {children}
    </MediaContext.Provider>
  )
}

export const useMediaContext = () => useContext(MediaContext)
