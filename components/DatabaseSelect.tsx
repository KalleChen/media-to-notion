import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Fragment, useEffect, useMemo } from 'react'

import { useAppContext } from '../contexts/AppContext'
import { DatabaseResponse } from '../pages/api/notion/database'

const DatabaseSelect: React.FC = () => {
  const { getDatabase, selectedDatabaseId, setSelectedDatabaseId, databases } =
    useAppContext()
  useEffect(() => {
    getDatabase()
  }, [getDatabase])
  const selectedDatabase = useMemo(():
    | DatabaseResponse['results'][0]
    | null => {
    return (
      databases?.find((database) => database.id === selectedDatabaseId) || null
    )
  }, [databases, selectedDatabaseId])
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
        <Listbox value={selectedDatabaseId} onChange={setSelectedDatabaseId}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">
                {selectedDatabase && 'title' in selectedDatabase
                  ? selectedDatabase.title[0]?.plain_text
                  : 'Select a database'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {databases
                  .filter((db) => 'title' in db)
                  .map((db) => (
                    <Listbox.Option
                      key={db.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-gray-900'
                        }`
                      }
                      value={db.id}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {'title' in db ? db.title[0].plain_text : 'No name'}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      )}
    </div>
  )
}

export default DatabaseSelect
