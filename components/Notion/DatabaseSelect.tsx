import { useEffect } from 'react'

import { useNotionContext } from '../../contexts/NotionContext'
import Select from '../UI/Select'

const DatabaseSelect: React.FC = () => {
  const { getDatabase, selectedDatabaseId, setSelectedDatabaseId, databases } =
    useNotionContext()

  // fetch database from notion
  useEffect(() => {
    getDatabase()
  }, [getDatabase])

  return (
    <div className="w-1/2">
      {!databases ? (
        <>
          {!Array.isArray(databases) ? (
            <div>Loading...</div>
          ) : (
            <div>No databases found</div>
          )}
        </>
      ) : (
        <Select
          value={selectedDatabaseId}
          onChange={setSelectedDatabaseId}
          options={databases.map((database) => ({
            id: database.id,
            title: 'title' in database ? database.title[0].plain_text : null,
          }))}
        />
      )}
    </div>
  )
}

export default DatabaseSelect
