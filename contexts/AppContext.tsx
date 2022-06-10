import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import axios from 'axios'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { DatabaseResponse } from '../pages/api/notion/database'
import { PropertyResnponse } from '../pages/api/notion/property'

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
  properties: PropertyResnponse | null
  propertiesMapping: Record<string, CreatePageParameters['properties']>
  handleChangePropertyMapping: (
    key: string,
    value: CreatePageParameters['properties']
  ) => void
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
  properties: null,
  propertiesMapping: {},
  handleChangePropertyMapping: () => {},
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
  const [properties, setProperties] =
    useState<AppContextInterface['properties']>(null)
  const [propertiesMapping, setPropertiesMapping] = useState<
    AppContextInterface['propertiesMapping']
  >({})
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
  const getProperty = useCallback(async () => {
    if (notionToken && selectedDatabaseId) {
      const { data } = await axios.get<PropertyResnponse>(
        '/api/notion/property',
        {
          params: {
            accessToken: notionToken,
            id: selectedDatabaseId,
          },
        }
      )
      setProperties(data)
    }
  }, [notionToken, selectedDatabaseId])
  const handleChangePropertyMapping = useCallback(
    (key: string, value: CreatePageParameters['properties']) => {
      setPropertiesMapping(
        (prevState: AppContextInterface['propertiesMapping']) => ({
          ...prevState,
          [key]: value,
        })
      )
    },
    []
  )
  useEffect(() => {
    if (notionToken && selectedDatabaseId) {
      getProperty()
    }
  }, [notionToken, selectedDatabaseId, getProperty])
  const contextValues = {
    notionToken,
    setNotionToken,
    user,
    setUser,
    getDatabase,
    databases,
    selectedDatabaseId,
    setSelectedDatabaseId,
    properties,
    propertiesMapping,
    handleChangePropertyMapping,
  }
  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
