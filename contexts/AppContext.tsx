import { createContext, useContext, useState } from 'react'

interface AppContextInterface {
  notionToken: string | null
  setNotionToken: (token: string | null) => void
  user: {
    [key: string]: any
  } | null
  setUser: (user: { [key: string]: any } | null) => void
}

interface Props {
  children: React.ReactNode
}
const initialValue: AppContextInterface = {
  notionToken: '',
  setNotionToken: () => {},
  user: null,
  setUser: () => {},
}

const AppContext = createContext<AppContextInterface>(initialValue)

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [notionToken, setNotionToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ [key: string]: any } | null>({})
  const contextValues = {
    notionToken: notionToken,
    setNotionToken: setNotionToken,
    user: user,
    setUser: setUser,
  }
  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
