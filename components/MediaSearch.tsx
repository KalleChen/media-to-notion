import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Fragment, useEffect, useMemo, useState } from 'react'

import { useMediaContext } from '../contexts/MediaContext'
const MediaSearch: React.FC = () => {
  const { medias, searchMedia, selectedMediaId, setSelectedMediaId } =
    useMediaContext()

  const [query, setQuery] = useState('')

  const selectedMedia = useMemo((): Record<string, string> | null => {
    return medias.find((media) => media.id === selectedMediaId) || null
  }, [medias, selectedMediaId])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 0) {
        searchMedia(query)
      }
    }, 800)
    return () => clearTimeout(timeoutId)
  }, [query, searchMedia])

  return (
    <div className="flex flex-row items-center w-1/2">
      <Combobox value={selectedMediaId} onChange={setSelectedMediaId}>
        <div className="relative w-full">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={() => selectedMedia?.title || ''}
              onChange={(event) => {
                setQuery(event.target.value)
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {medias.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                medias.map((media) => (
                  <Combobox.Option
                    key={media.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={media.id}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {media.title}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default MediaSearch
