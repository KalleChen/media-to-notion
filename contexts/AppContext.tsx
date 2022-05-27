import { createContext, useContext, useState } from 'react'

interface AppContextInterface {
  notionToken: string | null
  setNotionToken: (token: string | null) => void
  user: {
    [key: string]: any
  }
  setUser: (user: { [key: string]: any }) => void
}

interface Props {
  children: React.ReactNode
}

const AppContext = createContext<AppContextInterface>(null)

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [notionToken, setNotionToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ [key: string]: any }>({})
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
