import { useEffect, useState } from 'react'

import { useMediaContext } from '../../contexts/MediaContext'

const MediaUrlInput = () => {
  const { setSelectedMediaId } = useMediaContext()
  const [mediaUrl, setMediaUrl] = useState<string>('')

  useEffect(() => {
    const mediaId = mediaUrl?.split('title/')?.[1]?.split('/')?.[0]
    if (mediaId) {
      setSelectedMediaId(mediaId)
    }
  }, [mediaUrl, setSelectedMediaId])

  return (
    <input value={mediaUrl} onChange={(e) => setMediaUrl(e?.target?.value)} />
  )
}

export default MediaUrlInput
