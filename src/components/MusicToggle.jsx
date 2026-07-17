import { useEffect, useRef, useState } from 'react'
import { site } from '../config'

export default function MusicToggle() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  // Try to auto-start the music as soon as this mounts (i.e. as soon as
  // the hero page shows up). Browsers sometimes block audio that starts
  // without a click, so if that happens we just fall back to the manual
  // toggle button below.
  useEffect(() => {
    if (!site.musicSrc || !audioRef.current) return
    const audio = audioRef.current
    const tryPlay = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
    tryPlay()

    // If autoplay was blocked, start it on the first click/tap anywhere.
    const onFirstInteract = () => {
      if (audio.paused) tryPlay()
      window.removeEventListener('pointerdown', onFirstInteract)
      window.removeEventListener('keydown', onFirstInteract)
    }
    window.addEventListener('pointerdown', onFirstInteract)
    window.addEventListener('keydown', onFirstInteract)
    return () => {
      window.removeEventListener('pointerdown', onFirstInteract)
      window.removeEventListener('keydown', onFirstInteract)
    }
  }, [])

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
      <audio ref={audioRef} src={site.musicSrc} loop autoPlay />
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
