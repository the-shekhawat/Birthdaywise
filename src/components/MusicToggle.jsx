import { useRef, useState } from 'react'
import { site } from '../config'

export default function MusicToggle() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  if (!site.musicSrc) return null

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying((p) => !p)
  }

  return (
    <>
      <audio ref={audioRef} src={site.musicSrc} loop />
      <button
        onClick={toggle}
        className="fixed right-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-cream-100/20 bg-night-900/70 text-lg backdrop-blur transition-transform hover:scale-110"
        aria-label="Toggle music"
      >
        {playing ? '🔊' : '🔈'}
      </button>
    </>
  )
}
