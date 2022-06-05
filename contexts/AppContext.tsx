import axios from 'axios'
import { createContext, useCallback, useContext, useState } from 'react'

import { DatabaseResponse } from '../pages/api/notion/database'

export interface AppContextInterface {
  notionToken: string | null
  setNotionToken: (token: string | null) => void
  user: {
    [key: string]: any
  } | null
  setUser: (user: { [key: string]: any } | null) => void
  getDatabase: () => Promise<void>
  databases: DatabaseResponse['results'] | null
  selectedDatabaseId: string | null
  setSelectedDatabaseId: (database: string | null) => void
}

interface Props {
  children: React.ReactNode
}
const initialValue: AppContextInterface = {
  notionToken: '',
  setNotionToken: () => {},
  user: null,
  setUser: () => {},
  getDatabase: async () => {},
  databases: null,
  selectedDatabaseId: null,
  setSelectedDatabaseId: () => {},
}

const AppContext = createContext<AppContextInterface>(initialValue)

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [notionToken, setNotionToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ [key: string]: any } | null>({})
  const [databases, setDatabases] =
    useState<AppContextInterface['databases']>(null)
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(
    null
  )
  const getDatabase = useCallback(async (): Promise<void> => {
    if (notionToken) {
      const { data } = await axios.get<DatabaseResponse>(
        '/api/notion/database',
        {
          params: {
            accessToken: notionToken,
          },
        }
      )
      setDatabases(data.results)
    }
  }, [notionToken])
  const contextValues = {
    notionToken,
    setNotionToken,
    user,
    setUser,
    getDatabase,
    databases,
    selectedDatabaseId,
    setSelectedDatabaseId,
  }
  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
