import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { site } from '../config'
import SectionHeading from './SectionHeading'

function getLifeMetrics() {
  const birthTime = new Date(site.birthdayDate).getTime()
  const now = Date.now()
  const diff = now - birthTime

  if (diff < 0) return null

  const totalSeconds = Math.floor(diff / 1000)
  const totalMinutes = Math.floor(diff / (1000 * 60))
  const totalHours = Math.floor(diff / (1000 * 60 * 60))
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))

  return {
    days: totalDays,
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
  }
}

function getCalendarAge() {
  const birth = new Date(site.birthdayDate)
  const now = new Date()
  if (now < birth) return null

  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

function getWonderStats(lifeMetrics) {
  if (!lifeMetrics) return null
  const AVG_RESTING_HEART_RATE = 80 
  const AVG_BREATHS_PER_MIN = 16
  const EARTH_ORBIT_SPEED_KMH = 107000 

  return {
    heartbeats: Math.round(lifeMetrics.minutes * AVG_RESTING_HEART_RATE),
    breaths: Math.round(lifeMetrics.minutes * AVG_BREATHS_PER_MIN),
    orbitDistanceKm: Math.round(lifeMetrics.hours * EARTH_ORBIT_SPEED_KMH),
    sunrises: lifeMetrics.days,
  }
}

function getTimeLeft() {
  const diff = new Date(site.birthdayDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Starfield({ count = 28 }) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.6 + 0.8,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2.5,
    }))
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-rose-400"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: 0.6,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function Countdown() {
  const [left, setLeft] = useState(getTimeLeft())
  const [lifeMetrics, setLifeMetrics] = useState(getLifeMetrics())
  const [celebrated, setCelebrated] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(getTimeLeft())
      setLifeMetrics(getLifeMetrics())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!left && !celebrated) {
      setCelebrated(true)
      const duration = 4 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 }

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now()
        if (timeLeft <= 0) return clearInterval(interval)
        const particleCount = 50 * (timeLeft / duration)

        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
      }, 250)
    }
  }, [left, celebrated])

  const calendarAge = getCalendarAge()
  const wonderStats = getWonderStats(lifeMetrics)

  return (
    <section id="countdown" className="px-6 py-24 max-w-5xl mx-auto text-[#4c0519] selection:bg-rose-100">
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.005); filter: drop-shadow(0 4px 20px rgba(225,29,72,0.1)); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); filter: blur(1px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes ringSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .luxury-pulse { animation: pulseGlow 3s ease-in-out infinite; }
        .luxury-float { animation: floatSlow 4s ease-in-out infinite; }
        .stagger-in { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .orbit-ring { animation: ringSpin 22s linear infinite; }
        .orbit-ring-slow { animation: ringSpin 36s linear infinite reverse; }
      `}</style>

      <SectionHeading
        eyebrow={left ? 'marking the moment' : 'your cosmic journey'}
        title={left ? 'The Countdown Begins' : 'Time Radiated on Earth'}
      />

      <div className="mx-auto flex flex-col items-center mt-12 w-full">
        {left ? (
          /* STANDARD COUNTDOWN STATE */
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full luxury-float">
            {[
              ['Days', left.days],
              ['Hours', left.hours],
              ['Minutes', left.minutes],
              ['Seconds', left.seconds],
            ].map(([label, value], i) => (
              <div
                key={label}
                className="stagger-in relative flex w-24 sm:w-28 flex-col items-center rounded-2xl border border-rose-200 bg-white py-6 shadow-[0_8px_30px_rgba(225,29,72,0.08)] backdrop-blur-md"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-rose-600 via-pink-600 to-rose-800 bg-clip-text text-transparent">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="w-8 h-[2px] bg-rose-300 my-2.5 rounded-full" />
                {/* Changed text color class to text-rose-800 for stark visibility */}
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-rose-800">
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* LIVE TIME ACCUMULATOR */
          <div className="w-full flex flex-col items-center gap-8">
            {/* Premium Message Card */}
            <div className="stagger-in w-full max-w-xl border-2 border-rose-100 bg-white rounded-2xl p-6 sm:p-8 text-center shadow-[0_20px_50px_rgba(225,29,72,0.08)] luxury-pulse relative overflow-hidden">
              <Starfield />
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />

              {/* Orbit Rings adjusted opacity for white screens */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.35]">
                <div className="orbit-ring w-64 h-64 rounded-full border border-rose-200" />
                <div className="orbit-ring-slow absolute w-44 h-44 rounded-full border border-pink-200" />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 mb-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-600" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700">
                    Live
                  </span>
                </div>

                <p className="font-display text-2xl sm:text-3xl bg-gradient-to-r from-rose-700 via-pink-600 to-rose-900 bg-clip-text text-transparent font-black tracking-wide">
                  🎉 Happy Birthday!
                </p>

                {calendarAge && (
                  <p className="text-rose-950 text-base sm:text-lg mt-3 font-bold tracking-wide">
                    You've been here for{' '}
                    <span className="text-rose-700 font-black">{calendarAge.years}</span> years,{' '}
                    <span className="text-rose-700 font-black">{calendarAge.months}</span> months, and{' '}
                    <span className="text-rose-700 font-black">{calendarAge.days}</span> days
                  </p>
                )}

                {/* Changed text color class to text-rose-900 */}
                <p className="text-rose-900 text-sm mt-3 font-medium tracking-wide leading-relaxed">
                  Every second is a beautiful milestone — here's the exact time, down to the second:
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            {lifeMetrics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mt-2">
                {[
                  ['Total Days Lived', lifeMetrics.days, 'from-rose-600 to-pink-600'],
                  ['Total Hours Lived', lifeMetrics.hours, 'from-pink-600 to-fuchsia-600'],
                  ['Total Minutes Lived', lifeMetrics.minutes, 'from-fuchsia-600 to-purple-600'],
                  ['Total Seconds Lived', lifeMetrics.seconds, 'from-purple-600 to-rose-700'],
                ].map(([label, value, gradient], i) => (
                  <div
                    key={label}
                    className="stagger-in group relative flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-white p-6 shadow-[0_10px_25px_rgba(225,29,72,0.06)] transition-all duration-300 hover:border-rose-400 hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ animationDelay: `${150 + i * 90}ms` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
                    <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none`} />

                    <span className={`font-mono text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent tabular-nums drop-shadow-sm`}>
                      {Number(value).toLocaleString()}
                    </span>

                    {/* Changed text color class to text-rose-800 */}
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-rose-800 mt-2 text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Playful Trivia Boxes */}
            {wonderStats && (
              <div className="w-full max-w-4xl mt-2">
                {/* Changed header title color to text-rose-900 */}
                <p className="text-center text-[11px] uppercase tracking-widest text-rose-900 font-bold mb-4">
                  A few (approximate) wonders along the way
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    ['❤️', 'Heartbeats', wonderStats.heartbeats],
                    ['🌬️', 'Breaths Taken', wonderStats.breaths],
                    ['🌅', 'Sunrises Witnessed', wonderStats.sunrises],
                    ['🪐', 'KM Traveled Around the Sun', wonderStats.orbitDistanceKm],
                  ].map(([icon, label, value], i) => (
                    <div
                      key={label}
                      className="stagger-in flex flex-col items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-4 text-center shadow-[0_4px_15px_rgba(225,29,72,0.04)]"
                      style={{ animationDelay: `${500 + i * 90}ms` }}
                    >
                      <span className="text-xl leading-none">{icon}</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-rose-950 tabular-nums">
                        {value.toLocaleString()}
                      </span>
                      {/* Changed subtitle text color to text-rose-800 */}
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-800">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}