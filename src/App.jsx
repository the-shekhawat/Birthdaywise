import { useState } from 'react'
import StarsBackground from './components/StarsBackground'
import CursorTrail from './components/CursorTrail'
import LockScreen from './components/LockScreen'
import Loader from './components/Loader'
import Landing from './components/Landing'
import WelcomeTransition from './components/WelcomeTransition'
import MusicToggle from './components/MusicToggle'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Timeline from './components/Timeline'
import Letter from './components/Letter'
import UsBears from './components/UsBears'
import Reasons from './components/Reasons'
import Gallery from './components/Gallery'
import Cake from './components/Cake'
import GiftBoxes from './components/GiftBoxes'
import Quiz from './components/Quiz'

import BalloonPop from './components/BalloonPop'
import SecretUnlock from './components/SecretUnlock'
import WishWall from './components/WishWall'
import Finale from './components/Finale'

// Stage flow: 'lock' -> 'loading' -> 'landing' -> 'transition' -> 'site'
export default function App() {
  const [stage, setStage] = useState('lock')

  return (
    <div className="relative min-h-screen">
      <StarsBackground />
      <CursorTrail />

      {stage === 'lock' && <LockScreen onUnlock={() => setStage('loading')} />}
      {stage === 'loading' && <Loader onDone={() => setStage('landing')} />}
      {stage === 'landing' && <Landing onEnter={() => setStage('transition')} />}
      {stage === 'transition' && <WelcomeTransition onDone={() => setStage('site')} />}


      {stage === 'site' && (
  <main className="relative bg-gradient-to-br from-[#fff0f5] via-[#ffb7d5] to-[#f472b6] min-h-screen">
    <MusicToggle />
    {/* FIXED BACKDROP LAYER */}
    <div
      className="fixed inset-0 z-0 bg-center bg-no-repeat bg-[length:70%_auto] md:bg-[length:35%_auto] opacity-60 pointer-events-none"
      style={{ 
        backgroundImage: "url('/images/bubu-dudu.gif')",
        // Removed mix-blend-multiply to ensure it doesn't turn invisible against the pink gradient
      }}
      aria-hidden="true"
    />

    {/* CONTENT CONTAINERS */}
    {/* Note: Ensure your components inside don't have heavy, opaque background colors like "bg-white" or "bg-[#ffc1de]". 
        They should use transparent backgrounds (like "bg-transparent") so this image can shine through them! */}
    <div className="relative z-10">
      <Hero />
      <Countdown />
      <Timeline />
      <Letter />
      <UsBears />
      <Gallery />
      <Cake />
      <BalloonPop />
      <WishWall />
      <Finale />
    </div>
  </main>
)}
    </div>
  )
}
