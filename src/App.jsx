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
      <MusicToggle />

      {stage === 'lock' && <LockScreen onUnlock={() => setStage('loading')} />}
      {stage === 'loading' && <Loader onDone={() => setStage('landing')} />}
      {stage === 'landing' && <Landing onEnter={() => setStage('transition')} />}
      {stage === 'transition' && <WelcomeTransition onDone={() => setStage('site')} />}

      {stage === 'site' && (
        <main className="relative">
          <div
            className="fixed inset-0 -z-10 bg-center bg-no-repeat bg-[length:50%] opacity-50 pointer-events-none"
            style={{ backgroundImage: "url('/images/bubu-dudu.gif')" }}
            aria-hidden="true"
          />
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
        </main>
      )}
    </div>
  )
}
