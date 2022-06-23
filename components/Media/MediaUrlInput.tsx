import { useEffect, useState } from 'react'

import { useMediaContext } from '../../contexts/MediaContext'
import Input from '../UI/Input'

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
    <div className="w-1/2">
      <Input value={mediaUrl} onChange={(v: string) => setMediaUrl(v)} />
    </div>
  )
}

export default MediaUrlInput
